import { Component, VERSION } from '@angular/core';
// 
// import {MainPageComponent} from './main-page/main-page.component';
// import { FormGroup, FormControl } from '@angular/forms';
// import { Validators } from '@angular/forms';


// async function loginEmailPassword(email, password) {
//   // Create an anonymous credential
//   const app = new Realm.App("data-icqqg")
//   const credentials = Realm.Credentials.emailPassword(email, password);
//   try {
//     // Authenticate the user
//     const user = await app.logIn(credentials);
//     // `App.currentUser` updates to match the logged in user
//     console.assert(user.id === app.currentUser.id);
//     return user;
//   } catch (err) {
//     console.error("Failed to log in", err);
//     //return err.__zone_symbol__state
//   }
// }
// //const user = loginEmailPassword("spalette@feyel-artzner.com", "FeyelR&D");
// //console.log("Successfully logged in!", user);


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  saveData(key:string,value:any) {
    sessionStorage.setItem(key, value);
  }
  getData(key:string) {
    return sessionStorage.getItem(key);
  }
  deleteData(){
    sessionStorage.clear();
  }
}
