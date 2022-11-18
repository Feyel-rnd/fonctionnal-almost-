import { Component, VERSION } from '@angular/core';
import * as Realm from 'realm-web';
import { MainPageComponent } from '../main-page/main-page.component';
import { FormGroup, FormControl, EmailValidator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

async function sendPasswordReset(email) {
  // Create an anonymous credential
  const app = new Realm.App('data-icqqg');
  // const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    // Authenticate the user
    await app.emailPasswordAuth.sendResetPasswordEmail({ email });
    // await app.emailPasswordAuth.registerUser({ email, password });
    // `App.currentUser` updates to match the logged in user

    console.log('Successfull pending request !');
  } catch (err) {
    console.error('Failed', err);
    //return err.__zone_symbol__state
  }
}
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  connected = true;
  correctForm = true;
  hide = true;
  redirect = false;
  sent = false;
  constructor(public router: Router) {}
  CheckForm() {
    if (
      this.signinForm.controls['email'].status == 'INVALID'
      // this.signinForm.controls['password'].status == 'INVALID' ||
      // this.signinForm.controls['confirmedPassword'].status == 'INVALID' ||
      // this.signinForm.controls['confirmedPassword'].value !=
      // this.signinForm.controls['password'].value
    ) {
      this.correctForm = false;
    } else {
      this.correctForm = true;
    } //"^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
  }
  signinForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@feyel-artzner.com$'),
    ]),
    // password: new FormControl('', Validators.required),
    // confirmedPassword: new FormControl('', Validators.required),
  });
  app = new Realm.App('data-icqqg');

  Reset(email: string) {
    //console.log
    this.CheckForm();
    if (this.correctForm) {
      //console.log(this.correctForm)

      const response: any = sendPasswordReset(email);
      const user = {
        username: email,
      };
      //this.insert_doc("users",user)
      this.sent = true;
      //console.log(user.__zone_symbol__value[0])
    } else {
      this.connected = false;
    }
  }
  // async insert_doc(collection: string, doc: any) {
  //   const mongo = this.app.currentUser.mongoClient('Cluster0');
  //   const collec = mongo.db('Data').collection(collection);
  //   const result = await collec.insertOne(doc);
  //   //console.log(result);
  // }
}
