import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConnexionFormComponent } from './connexion-form.component';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from '../../material/material.module';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  declarations: [ConnexionFormComponent, ForgotPasswordComponent,ResetPasswordComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConnexionFormModule {}
