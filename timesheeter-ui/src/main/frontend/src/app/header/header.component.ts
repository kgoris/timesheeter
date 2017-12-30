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
  isAdmin : boolean;
  isUser : boolean;

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
  ngOnInit() {
    this.userService.isAdmin.subscribe(x => this.isAdmin = x);
    this.userService.isUser.subscribe(x => this.isUser = x);
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
