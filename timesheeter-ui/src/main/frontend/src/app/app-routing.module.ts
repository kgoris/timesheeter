import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginGuard } from './guard';
import { GuestGuard, AdminGuard } from './guard';
import { NotFoundComponent } from './not-found';
import { ForbiddenComponent } from './forbidden';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {AdminComponent} from "./admin/admin.component";
import {TimesheetComponent} from "./timesheet/timesheet.component";
import {DetailComponent} from "./detail/detail.component";
import {HistoriqueComponent} from "./historique/historique.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path:'refresh',
    component: AppComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'timesheet',
    component: TimesheetComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'detail',
    component: DetailComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'historique',
    component: HistoriqueComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '403',
    component: ForbiddenComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
