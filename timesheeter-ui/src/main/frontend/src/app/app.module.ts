import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import {NotFoundComponent} from "./not-found";
import {ForbiddenComponent} from "./forbidden";
import {FormsModule, FormControl, ReactiveFormsModule} from "@angular/forms";
import {AdminGuard, GuestGuard, LoginGuard} from "./guard";
import {ApiService, AuthService, BusinessService, ConfigService, UserService} from "./service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { TimesheetComponent } from './timesheet/timesheet.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChangePasswordComponent,
    AdminComponent,
    LoginComponent,
    HeaderComponent,
    NotFoundComponent,
    ForbiddenComponent,
    TimesheetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    LoginGuard,
    GuestGuard,
    AdminGuard,
    AuthService,
    ApiService,
    UserService,
    ConfigService,
    BusinessService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
