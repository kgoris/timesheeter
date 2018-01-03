import {Component, Input, OnInit} from '@angular/core';
import {AuthService, UserService} from "../service";
import {Router} from "@angular/router";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit {

  isMenuCollapsed : boolean;


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isMenuCollapsed = false;
  }
  onClick(){
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  onDetail(){
    this.router.navigate(["/detail"]);
  }
  onHistorique(){
    this.router.navigate(["/historique"]);
  }
  onEncodage(){
    this.router.navigate(["/timesheet"]);
  }
  onUtilisateurs(){
    this.router.navigate(["/users"]);
  }

  onChantiers(){
    this.router.navigate(["/chantiers"]);
  }

  onClients(){
    this.router.navigate(["/clients"]);
  }

  ngOnInit() {
  }

  isAdmin(){
    if(this.hasSignedIn()){
      return JSON.stringify(this.userService.currentUser.authorities).search('ROLE_ADMIN') !== -1;
    }
  }
  logout() {
    this.authService.logout().subscribe(res => {
      this.router.navigate(['/login']);
    });
  }

  hasSignedIn() {
    return !!this.userService.currentUser;
  }

  userName() {
    const user = this.userService.currentUser;
    return user.firstname + ' ' + user.lastname;
  }

}
