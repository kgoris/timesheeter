import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Chantier} from "../modeles/chantier";
import {BusinessService} from "../service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {User} from "../modeles/User";

@Component({
  selector: 'app-chantier-detail',
  templateUrl: './chantier-detail.component.html',
  styleUrls: ['./chantier-detail.component.css']
})
export class ChantierDetailComponent implements OnInit {

  private form: FormGroup;
  private currentChantier: Chantier;
  private displayMessage : string;
  private error: boolean;
  private submitted : boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService) { }

  ngOnInit() {
    this.currentChantier = new Chantier();
    this.currentChantier.new = true;

    this.error = false;
    this.submitted = false;
    this.form = this.formBuilder.group({});
    this.route.params
      .switchMap((params: Params) => this.businessService.getChantierById(+params['id']))
      .subscribe(
        (chantier: Chantier) => {
          this.currentChantier = chantier;
        }
      );
  }

  onSubmit(){

    this.submitted = true;
    if(this.currentChantier.new){
      this.businessService.createChantier(this.currentChantier).subscribe(
        () => {
          this.displayMessage = "Le chantier a été créé";
        },
        error => {
          this.displayMessage = "Création du chantier - erreur";
          this.error = true;
          console.error(this.displayMessage)
        }
      );
    } else{
      this.businessService.updateChantier(this.currentChantier).subscribe(
        () => {
          this.displayMessage = "le chantier a été modifié";
        },
        error => {
          this.displayMessage = "Modification du chantier - erreur";
          this.error = true;
          console.error(this.displayMessage)
        }
      );
    }
  }

  onReturn(){
    this.router.navigate(['/chantiers']);
  }

}
