import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogInfo, MainPageComponent } from './main-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialExampleModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { AnswerPageComponent } from './answer-page/answer-page.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CreateAnalysisPageComponent } from './create-analysis-page/create-analysis-page.component';
import { MySensoryProfilePageComponent } from './my-sensory-profile-page/my-sensory-profile-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ConnectedUsersComponent } from './connected-users/connected-users.component';
import { SensoryProfilesPageComponent } from './sensory-profiles-page/sensory-profiles-page.component';
import { MyProfilePageComponent } from './my-profile-page/my-profile-page.component';
import { MyAnalysisPageComponent } from './my-analysis-page/my-analysis-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { RadioButtonComponent } from './answer-page/radio-button/radio-button.component';
import { SliderComponent } from './answer-page/slider/slider.component';
import { FormComponent } from './answer-page/form/form.component';
import { TableComponent } from './answer-page/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AnalysisTableComponent,
  DialogOnDelete,
} from './my-analysis-page/analysis-table/analysis-table.component';
import { AnalysisViewComponent } from './my-analysis-page/analysis-view/analysis-view.component';
import {
  AnalysisAdminViewComponent,
  DialogDeleteAnswer,
} from './my-analysis-page/analysis-admin-view/analysis-admin-view.component';
import { ChartsModule } from 'ng2-charts';
import { ProfileContentComponent } from './my-profile-page/profile-content/profile-content.component';
import { SuccessComponent } from './my-profile-page/success/success.component';
import {
  DialogData,
  RegisterPageComponent,
} from './register-page/register-page.component';
import { InputTextComponent } from './answer-page/input-text/input-text.component';
import { TrainingInputComponent } from './answer-page/training-input/training-input.component';
import { UsersProfileViewComponent } from './connected-users/users-profile-view/users-profile-view.component';
import {
  ConnectedUsersTableComponent,
  DialogDeleteUser,
} from './connected-users/connected-users-table/connected-users-table.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    MaterialExampleModule,
    RouterModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    ChartsModule,
    FormsModule,

    //AppModule
  ],
  declarations: [
    MainPageComponent,
    AnswerPageComponent,
    CreateAnalysisPageComponent,
    MySensoryProfilePageComponent,
    HomePageComponent,
    ConnectedUsersComponent,
    SensoryProfilesPageComponent,
    MyProfilePageComponent,
    MyAnalysisPageComponent,
    SettingsPageComponent,
    RadioButtonComponent,
    SliderComponent,
    FormComponent,
    TableComponent,
    InputTextComponent,
    AnalysisTableComponent,
    AnalysisViewComponent,
    AnalysisAdminViewComponent,
    ProfileContentComponent,
    SuccessComponent,
    RegisterPageComponent,
    DialogData,
    DialogOnDelete,
    DialogDeleteUser,
    DialogDeleteAnswer,
    TrainingInputComponent,
    ConnectedUsersTableComponent,
    UsersProfileViewComponent,
    DialogInfo,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPageModule {}
