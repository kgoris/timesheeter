import { Component, OnInit } from '@angular/core';
import {UserService} from "../service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService:UserService) {}
  hasSignedIn() {
    return !!this.userService.currentUser;
  }

  isAdmin(){
    return JSON.stringify(this.userService.currentUser.authorities).search('ROLE_ADMIN') !== -1;
  }

  ngOnInit() {
  }

}
