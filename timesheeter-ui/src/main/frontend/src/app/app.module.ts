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
import { DetailComponent } from './detail/detail.component';
import { HistoriqueComponent } from './historique/historique.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ChantierComponent } from './chantier/chantier.component';
import { ChantiersComponent } from './chantiers/chantiers.component';
import { ChantierDetailComponent } from './chantier-detail/chantier-detail.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';



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
    DetailComponent,
    HistoriqueComponent,
    UsersComponent,
    UserDetailComponent,
    ChantierComponent,
    ChantiersComponent,
    ChantierDetailComponent,
    ClientsComponent,
    ClientDetailComponent,
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
