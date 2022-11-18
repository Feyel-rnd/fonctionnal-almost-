import { Component, VERSION } from '@angular/core';
import * as Realm from 'realm-web';
import { MainPageComponent } from '../main-page/main-page.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import ObjectID from 'bson-objectid';

// var frontendTokenDef: any = false;

async function loginEmailPassword(email, password, app) {
  // Create an anonymous credential

  const credentials = Realm.Credentials.emailPassword(email, password);

  try {
    // Authenticate the user
    const user = await app.logIn(credentials);

    // `App.currentUser` updates to match the logged in user
    console.assert(user.id === app.currentUser.id);
    //this.app = new Realm.App('data-icqqg')
    //this.userRefreshToken = sessionStorage.getItem("userRefreshToken");
    const userRefreshToken = user.refreshToken;
    //console.log(app.currentUser)
    const emmail = user.profile.email;
    const username = emmail.split('@')[0];
    sessionStorage.setItem('email', emmail);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userId', user.id);
    sessionStorage.setItem('role', 'Jury');
    // sessionStorage.setItem('user', JSON.stringify(user));

    const mongo = user.mongoClient('Cluster0');
    const collection = mongo.db('Data').collection('users');
    const isfound = await collection.find({ id: user.id });
    const existing_user = isfound[0] != undefined;

    const moment = new Date();
    if (!existing_user) {
      collection.insertOne({
        _id: ObjectID(user.id),
        id: user.id,
        isLoggedIn: true,
        username: username,
        user_mail: emmail,
        created: moment,
        last_login: moment,
        roles: ['Jury'],
        allergies: [],
        // XP:0,
        sensory: {
          last_updated: '',
          tastes: {
            sweet: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            bitter: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            salty: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            umami: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            sour: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
          },
          scores: {
            Triangulaire: 0,
          },
        },
      });
    } else {
      collection.updateOne(
        { id: user.id },
        { $set: { last_login: moment, isLoggedIn: true } }
      );
    }
    return true;
  } catch (err) {
    //console.error('Failed to log in', err);
    //return err.__zone_symbol__state
    return false;
  }
}
//const user = loginEmailPassword("spalette@feyel-artzner.com", "FeyelR&D");
//console.log("Successfully logged in!", user);
async function loginAnonymous(app) {
  // Create an anonymous credential
  const credentials = Realm.Credentials.anonymous();
  try {
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    // console.log(user);
    console.assert(user.id === app.currentUser.id);
    sessionStorage.setItem('userId', user.id);
    const emmail = 'invité@feyel-artzner.com';
    const username = 'Invité';
    sessionStorage.setItem('email', emmail);
    sessionStorage.setItem('role', 'Invité');
    sessionStorage.setItem('username', username);
    const mongo = user.mongoClient('Cluster0');
    const collection = mongo.db('Data').collection('users');
    const isfound = await collection.find({ id: user.id });
    const existing_user = isfound[0] != undefined;

    const moment = new Date();
    if (!existing_user) {
      collection.insertOne({
        _id: ObjectID(user.id),
        id: user.id,
        isLoggedIn: true,
        username: username,
        user_mail: emmail,
        created: moment,
        last_login: moment,
        roles: ['Invité'],
        allergies: [],
        // XP:0,
        sensory: {
          last_updated: '',
          tastes: {
            sweet: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            bitter: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            salty: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            umami: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
            sour: {
              trials: 0,
              success: 0,
              quantification: 0.0,
            },
          },
          scores: {
            Triangulaire: 0,
          },
        },
      });
    } else {
      collection.updateOne(
        { id: user.id },
        { $set: { last_login: moment, isLoggedIn: true } }
      );
    }
    return true;
  } catch (err) {
    console.error('Failed to log in', err);
    return false;
  }
}
// const user = await loginAnonymous();
// console.log("Successfully logged in!", user.id);

@Component({
  selector: 'app-connexion-form',
  templateUrl: './connexion-form.component.html',
  styleUrls: ['./connexion-form.component.scss'],
})
export class ConnexionFormComponent {
  loading = false;
  connected = true;
  correctForm = true;
  hide = true;
  redirect = false;
  constructor(public router: Router) {}
  loginUser() {
    if (
      this.signinForm.controls['email'].status == 'INVALID' ||
      this.signinForm.controls['password'].status == 'INVALID'
    ) {
      this.correctForm = false;
    } else {
      this.correctForm = true;
    }
  }
  signinForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  app = new Realm.App('data-icqqg');
  panelOpenState = false;
  Log(a: string, b: string) {
    this.loading = true;
    //console.log
    this.loginUser();
    if (this.correctForm) {
      //console.log(this.correctForm)
      const app = environment.application;
      loginEmailPassword(a, b, app).then((authorized) => {
        if (authorized) {
          console.log('Successfully logged in!');
          // this.redirect = true;
          // //console.log(user.__zone_symbol__value)
          // Usually you would use the redirect URL from the auth service.
          // However to keep the example simple, we will always redirect to `/admin`.

          const redirectUrl = '/dashboard/home';

          // Redirect the user
          this.router.navigate([redirectUrl]);
          const mongo =
            environment.application.currentUser.mongoClient('Cluster0');
          const Data = mongo.db('Data');
          const users = Data.collection('users');
          users.updateOne(
            { '_id ': ObjectID(sessionStorage.getItem('userId')) },
            { $set: { isLoggedIn: true } }
          );
          this.loading = false;
        } else {
          this.connected = false;
          this.loading = false;
        }
      });
      //console.log(user.__zone_symbol__value[0])
    } else {
      this.loading = false;
    }
  }

  anonymousLog() {
    this.loading = true;
    //console.log
    //this.loginUser();

    //console.log(this.correctForm)
    const app = environment.application;
    loginAnonymous(app).then((authorized) => {
      if (authorized) {
        console.log('Successfully logged in!');
        // this.redirect = true;
        // //console.log(user.__zone_symbol__value)
        // Usually you would use the redirect URL from the auth service.
        // However to keep the example simple, we will always redirect to `/admin`.

        const redirectUrl = '/dashboard/home';

        // Redirect the user
        this.router.navigate([redirectUrl]);
        const mongo =
          environment.application.currentUser.mongoClient('Cluster0');
        const Data = mongo.db('Data');
        const users = Data.collection('users');
        users.updateOne(
          { '_id ': ObjectID(sessionStorage.getItem('userId')) },
          { $set: { isLoggedIn: true } }
        );
        this.loading = false;
      } else {
        this.connected = false;
        this.loading = false;
      }
    });
    //console.log(user.__zone_symbol__value[0])
  }
}

// export var frontendToken = frontendTokenDef;
