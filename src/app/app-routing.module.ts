import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';
import { Routes, RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { YourGuard } from './your-guard.guard';
import { ConnexionFormComponent } from './connexion-form/connexion-form.component';
import { CheckPageComponent } from './check-page/check-page.component';
import { HomePageComponent } from './main-page/home-page/home-page.component';
import { MySensoryProfilePageComponent } from './main-page/my-sensory-profile-page/my-sensory-profile-page.component';
import { MyAnalysisPageComponent } from './main-page/my-analysis-page/my-analysis-page.component';
import { AnswerPageComponent } from './main-page/answer-page/answer-page.component';
import { CreateAnalysisPageComponent } from './main-page/create-analysis-page/create-analysis-page.component';
import { SettingsPageComponent } from './main-page/settings-page/settings-page.component';
import { MyProfilePageComponent } from './main-page/my-profile-page/my-profile-page.component';
import { AdminGuard } from './main-page/admin.guard';
import { JuryGuard } from './main-page/jury.guard';
import { ConnectedUsersComponent } from './main-page/connected-users/connected-users.component';
import { ValidTokenGuard } from './main-page/valid-token.guard';
import { SensoryProfilesPageComponent } from './main-page/sensory-profiles-page/sensory-profiles-page.component';
//import { RegisterFormComponent } from './register-form/register-form.component';
import { CommonModule } from '@angular/common';

import { SuccessComponent } from './main-page/my-profile-page/success/success.component';
import { FormComponent } from './main-page/answer-page/form/form.component';
import { TableComponent } from './main-page/answer-page/table/table.component';
import { AnalysisTableComponent } from './main-page/my-analysis-page/analysis-table/analysis-table.component';
import { AnalysisViewComponent } from './main-page/my-analysis-page/analysis-view/analysis-view.component';
import { AnalysisAdminViewComponent } from './main-page/my-analysis-page/analysis-admin-view/analysis-admin-view.component';
import { ProfileContentComponent } from './main-page/my-profile-page/profile-content/profile-content.component';

import { UsersProfileViewComponent } from './main-page/connected-users/users-profile-view/users-profile-view.component';
import { ConnectedUsersTableComponent } from './main-page/connected-users/connected-users-table/connected-users-table.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

//const routes: Routes = []; // sets up routes constant where you define your routes
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: ConnexionFormComponent },
  {
    path: 'dashboard',
    component: MainPageComponent,
    // canActivate: [YourGuard],
    children: [
      {
        path: 'home', // child route path
        component: HomePageComponent, // child route component that the router renders
        canActivate: [ValidTokenGuard],
      },
      // {
      //   path: 'register', // child route path
      //   component: RegisterPageComponent, // child route component that the router renders
      //   canActivate: [ValidTokenGuard],
      // },
      {
        path: 'answer',
        component: AnswerPageComponent, // another child route component that the router renders

        children: [
          {
            path: '', // child route path
            component: TableComponent, // child route component that the router renders
            canActivate: [ValidTokenGuard],
          },
          {
            path: 'form', // child route path
            component: FormComponent, // child route component that the router renders
            canActivate: [ValidTokenGuard],
            children: [
              {
                path: 'view', // child route path
                component: AnalysisViewComponent, // child route component that the router renders
                canActivate: [ValidTokenGuard],
              },
            ],
          },
        ],
      },
      {
        path: 'my-analysis', // child route path
        component: MyAnalysisPageComponent, // child route component that the router renders

        children: [
          {
            path: '', // child route path
            component: AnalysisTableComponent, // child route component that the router renders
            canActivate: [ValidTokenGuard, JuryGuard],
          },
          {
            path: 'view', // child route path
            component: AnalysisViewComponent, // child route component that the router renders
            canActivate: [ValidTokenGuard, JuryGuard],
          },
          {
            path: 'admin-view', // child route path
            component: AnalysisAdminViewComponent, // child route component that the router renders
            canActivate: [AdminGuard, ValidTokenGuard],
          },
        ],
      },
      {
        path: 'my-sensory-profile',
        component: MySensoryProfilePageComponent, // another child route component that the router renders
        canActivate: [ValidTokenGuard, JuryGuard],
      },
      {
        path: 'create-analysis', // child route path
        canActivate: [AdminGuard, ValidTokenGuard],
        component: CreateAnalysisPageComponent, // child route component that the router renders
      },
      {
        path: 'connected-users', // child route path
        canActivate: [AdminGuard, ValidTokenGuard],
        component: ConnectedUsersComponent, // child route component that the router renders
        children: [
          {
            path: '', // child route path
            component: ConnectedUsersTableComponent, // child route component that the router renders
            canActivate: [AdminGuard, ValidTokenGuard],
          },
          {
            path: 'users-profile', // child route path
            component: UsersProfileViewComponent, // child route component that the router renders
            canActivate: [AdminGuard, ValidTokenGuard],
          },
        ],
      },
      {
        path: 'sensory-profiles', // child route path
        canActivate: [AdminGuard],
        component: SensoryProfilesPageComponent, // child route component that the router renders
        children: [
          {
            path: '', // child route path
            component: MySensoryProfilePageComponent, // child route component that the router renders
            canActivate: [ValidTokenGuard],
          },
        ],
      },
      {
        path: 'settings',
        component: SettingsPageComponent, // another child route component that the router renders
        canActivate: [ValidTokenGuard],
      },
      {
        path: 'profile', // child route path
        component: MyProfilePageComponent,
        canActivate: [ValidTokenGuard, JuryGuard],
        children: [
          {
            path: '', // child route path
            component: ProfileContentComponent, // child route component that the router renders
            canActivate: [ValidTokenGuard, JuryGuard],
          },
          {
            path: 'success/:id', // child route path
            component: SuccessComponent, // child route component that the router renders

            canActivate: [ValidTokenGuard, JuryGuard],
          },
        ],
      },
    ],
  },
  // { path: 'register-component', component: RegisterFormComponent },
  { path: 'create-account', component: SecondaryPageComponent },
  { path: 'check-page', component: CheckPageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
