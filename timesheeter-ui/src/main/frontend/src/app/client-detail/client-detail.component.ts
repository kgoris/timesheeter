import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BusinessService} from "../service";
import {Chantier} from "../modeles/chantier";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Client} from "../modeles/client";

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {

  form: FormGroup;
  currentClient: Client;
  displayMessage : string;
  error: boolean;
  submitted : boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService) { }

  ngOnInit() {
    this.currentClient = new Client();
    this.currentClient.new = true;

    this.error = false;
    this.submitted = false;
    this.form = this.formBuilder.group({});
    this.route.params
      .switchMap((params: Params) => this.businessService.getClientById(+params['id']))
      .subscribe(
        (client: Client) => {
          this.currentClient = client;
        }
      );
  }

  onSubmit(){

    this.submitted = true;
    if(this.currentClient.new){
      this.businessService.createClient(this.currentClient).subscribe(
        () => {
          this.displayMessage = "Le client a été créé";
        },
        error => {
          this.displayMessage = "Création du client - erreur";
          this.error = true;
          console.error(this.displayMessage)
        }
      );
    } else{
      this.businessService.updateClient(this.currentClient).subscribe(
        () => {
          this.displayMessage = "le client a été modifié";
        },
        error => {
          this.displayMessage = "Modification du client - erreur";
          this.error = true;
          console.error(this.displayMessage)
        }
      );
    }
  }

  onReturn(){
    this.router.navigate(['/clients']);
  }

}
