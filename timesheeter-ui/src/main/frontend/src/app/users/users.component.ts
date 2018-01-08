import { Component, OnInit } from '@angular/core';
import {UserService} from "../service";
import {Client} from "../modeles/client";
import {User} from "../modeles/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  allUsers:User[];
  constructor(private userService: UserService,  private router: Router) { }

  ngOnInit() {
    this.userService.getAll().subscribe(
      value => {
        this.allUsers = value as User[];
      }
      , error => {
        console.error("Business service - all clients - an error happened")
      }
    );
  }

  onUserClick(user:User){
    this.router.navigate(['/user-detail', user.id]);
  }

  onNewUser(){
    this.router.navigate(['/user-detail/new']);
  }

}
