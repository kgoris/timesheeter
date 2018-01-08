import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BusinessService, UserService} from "../service";
import {User} from "../modeles/User";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  form: FormGroup;
  currentUser: User;
  displayMessage : string;
  error: boolean;
  submitted : boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private businessService: BusinessService) { }

  ngOnInit() {
    this.error = false;
    this.submitted = false;
    this.currentUser = new User();
    this.currentUser.new = true;
    this.form = this.formBuilder.group({});
    this.route.params
      .switchMap((params: Params) => this.userService.getUserById(+params['id']))
      .subscribe(
        (user: User) => {
          this.currentUser = user;
        }
      );
  }


    onSubmit(){
      this.submitted = true;
      if(this.currentUser.new){
        this.businessService.createUser(this.currentUser).subscribe(
          () => {
            this.displayMessage = "L'utilisateur a été créé";
          },
          error => {
            let message = "Création de l'utilisateur - erreur";
            this.error = true;
            this.displayMessage = message;
            console.error(message)
          }
        );
      }else{
        this.businessService.updateUser(this.currentUser).subscribe(
          () => {
            this.displayMessage = "L'utilisateur a été modifié";
          },
          error => {
            let message = "Modification de l'utilisateur - erreur";
            this.error = true;
            this.displayMessage = message;
            console.error(message)
          }
        );
      }
    }

  onReturn(){
    this.router.navigate(['/users']);
  }
}
