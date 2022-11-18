import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import ObjectID from 'bson-objectid';
// import { frontendToken } from '../connexion-form/connexion-form.component';
//import * as Realm from 'realm-web';

var now = Date.now();

@Injectable()
export class ValidTokenGuard implements CanActivate {
  constructor(public router: Router, private _snackBar: MatSnackBar) {
    // setInterval(() => {
    //   //inactivity prune
    //   const app = environment.application;
    //   const user = app.allUsers[sessionStorage.getItem('userId')];
    //   if (user != null) {
    //     console.log('Déconnexion !');
    //     const mongo = user.mongoClient('Cluster0');
    //     const Data = mongo.db('Data');
    //     const users = Data.collection('users');
    //     users
    //       .updateOne(
    //         { '_id ': ObjectID(user.id) },
    //         { $set: { isLoggedIn: false } }
    //       )
    //       .then((value) => {
    //         sessionStorage.clear();
    //         user.logOut();
    //         router.navigate(['/login']);
    //         this.openSnackBar(
    //           'Votre session a expiré, veuillez vous reconnecter.',
    //           'Fermer'
    //         );
    //       });
    //   }
    // }, 5000);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // if (frontendToken) {
    //   return false;
    // }
    return true;
    // console.log(frontendToken);
    // const app = environment.application;
    // const user = app.allUsers[sessionStorage.getItem('userId')];
    // const mongo = environment.application.currentUser.mongoClient('Cluster0');
    // const Data = mongo.db('Data');
    // const users = Data.collection('users');

    // //console.log(user.refreshToken)
    // // console.log(user.refreshToken);
    // if (user.refreshToken == null || (Date.now() - now) / 1000 / 60 / 60 > 3) {
    //   const mongo = environment.application.currentUser.mongoClient('Cluster0');
    //   const Data = mongo.db('Data');
    //   const users = Data.collection('users');
    //   users.updateOne(
    //     { '_id ': ObjectID(sessionStorage.getItem('userId')) },
    //     { $set: { isLoggedIn: false } }
    //   );
    //   sessionStorage.clear();
    //   environment.application.currentUser.logOut();
    //   const redirectUrl = '/login';

    //   // Redirect the user
    //   this.router.navigate([redirectUrl]);
    //   this.openSnackBar(
    //     'Votre session a expiré, veuillez vous reconnecter.',
    //     'Fermer'
    //   );
    //   return false;
    // } else {
    //   return true;
    // }
  }
}
