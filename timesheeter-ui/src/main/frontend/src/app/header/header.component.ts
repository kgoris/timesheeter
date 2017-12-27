import { Component, OnInit } from '@angular/core';
import {AuthService, UserService} from "../service";
import {Router} from "@angular/router";

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
  ngOnInit() {
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
