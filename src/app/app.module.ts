import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { YourGuard } from './your-guard.guard';
import { SecondaryPageComponent } from './secondary-page/secondary-page.component';
import { ConnexionFormModule } from './connexion-form/connexion-form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainPageModule } from './main-page/main-page.module';
import { AdminGuard } from './main-page/admin.guard';
import { ValidTokenGuard } from './main-page/valid-token.guard';
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { CustomDateAdapter } from './custom-date-adapter';
import { JuryGuard } from './main-page/jury.guard';

const MY_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ConnexionFormModule,
    ReactiveFormsModule,
    MainPageModule,
  ],
  declarations: [AppComponent, HelloComponent, SecondaryPageComponent],
  bootstrap: [AppComponent],
  providers: [
    YourGuard,
    AdminGuard,
    JuryGuard,
    ValidTokenGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
