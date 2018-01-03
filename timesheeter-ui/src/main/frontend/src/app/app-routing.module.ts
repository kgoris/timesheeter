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
import {UsersComponent} from "./users/users.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {ChantiersComponent} from "./chantiers/chantiers.component";
import {ChantierDetailComponent} from "./chantier-detail/chantier-detail.component";
import {ClientsComponent} from "./clients/clients.component";
import {ClientDetailComponent} from "./client-detail/client-detail.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
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
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'user-detail/:id',
    component: UserDetailComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'user-detail/new',
    component: UserDetailComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'chantiers',
    component: ChantiersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'chantier-detail/:id',
    component: ChantierDetailComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'chantier-detail/new',
    component: ChantierDetailComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'client-detail/:id',
    component: ClientDetailComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'client-detail/new',
    component: ClientDetailComponent,
    canActivate: [AdminGuard],
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
