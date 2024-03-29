import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule, NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
import { ChantiersComponent } from './chantiers/chantiers.component';
import { ChantierDetailComponent } from './chantier-detail/chantier-detail.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { EncodingModalComponent } from './encoding-modal/encoding-modal.component';
import { EncodingModalContentComponent } from './encoding-modal-content/encoding-modal-content.component';
import {
  MatAutocomplete, MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatIconModule,
  MatInputModule
} from "@angular/material";
import {MatTableModule} from '@angular/material/table';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { DeleteModalContentComponent } from './delete-modal-content/delete-modal-content.component';
import {UtilService} from "./service/util.service";
import {DialogService} from "./service/dialog.service";
import {CanDesactivateGuard} from "./guard/can-desactivate-guard.service";
import { UserhistoricalComponent } from './userhistorical/userhistorical.component';
import {CdkTableModule} from "@angular/cdk/table";



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
    ChantiersComponent,
    ChantierDetailComponent,
    ClientsComponent,
    ClientDetailComponent,
    EncodingModalComponent,
    EncodingModalContentComponent,
    DeleteModalComponent,
    DeleteModalContentComponent,
    UserhistoricalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  entryComponents:[EncodingModalContentComponent, DeleteModalContentComponent],
  providers: [
    LoginGuard,
    GuestGuard,
    AdminGuard,
    CanDesactivateGuard,
    AuthService,
    ApiService,
    UserService,
    ConfigService,
    BusinessService,
    UtilService,
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
