import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Realm from 'realm-web';
import { FormGroup, FormControl, EmailValidator } from '@angular/forms';
import { Validators } from '@angular/forms';

async function passwordReset(emailDetails) {
  // Create an anonymous credential
  const app = new Realm.App('data-icqqg');
  // const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    // Authenticate the user
    await app.emailPasswordAuth.resetPassword(emailDetails);
    // await app.emailPasswordAuth.registerUser({ email, password });
    // `App.currentUser` updates to match the logged in user

    console.log('Successfull pending request !');
    return true;
  } catch (err) {
    console.error('Failed', err);
    return false;
    //return err.__zone_symbol__state
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  token: string;
  tokenId: string;
  result = false;
  async verify(token, tokenId) {
    const app = new Realm.App('data-icqqg');
    if (token === undefined || tokenId === undefined) {
      return false;
    }
    try {
      return true;
    } catch (err) {
      console.error('Failed', err);
      //console.log (err.__zone_symbol__state)
      return false;
    }
  }
  connected = true;
  correctForm = true;
  CheckForm() {
    if (
      this.signinForm.controls['password'].status == 'INVALID' ||
      this.signinForm.controls['confirmedPassword'].status == 'INVALID' ||
      this.signinForm.controls['confirmedPassword'].value !=
        this.signinForm.controls['password'].value
    ) {
      this.correctForm = false;
    } else {
      this.correctForm = true;
    } //"^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
  }
  signinForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmedPassword: new FormControl('', Validators.required),
  });
  sent = false;
  Reset() {
    //console.log
    this.CheckForm();
    if (this.correctForm && this.result) {
      //console.log(this.correctForm)

      passwordReset({
        password: this.signinForm.controls['password'].value,
        token: this.token,
        tokenId: this.tokenId,
      }).then((response) => {
        // console.log(response);
        if (response) {
          this.sent = true;
        } else {
          this.connected = false;
        }
      });
      //console.log(user.__zone_symbol__value[0])
    } else {
      this.connected = false;
    }
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      //console.log(params); // { order: "popular" }
      this.token = params.token;
      this.tokenId = params.tokenId;
      this.verify(this.token, this.tokenId).then((value) => {
        this.result = value;
        console.log(this.result);
      });
      //console.log(this.token); // popular
    });
  }
}
