import { Component, OnInit } from '@angular/core';
import {BusinessService} from "../service";
import {User} from "../modeles/User";
import {Chantier} from "../modeles/chantier";
import {Client} from "../modeles/client";
import {Timesheet} from "../modeles/timesheet";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Semaine} from "../modeles/Semaine";

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  private allUtilisateur: User[];
  private allChantiers: Chantier[];
  private allClients: Client[];

  private historyTypes: string [];
  private sortTypes: string [];
  private allMonth: string[];
  private allSemaines : Semaine[];
  private allTimesheet: Timesheet[];
  private chosenHistoryType : string;
  private chosenSortType : string;
  private chosenUtilisateur : User;
  private chosenChantier: string;
  private chosenClient:string;
  private chosenMonth: string;
  private chosenSemaine: string;

  private user_const: string = "Utilisateur";
  private chantier_const : string = "Chantier";
  private client_const : string = "Client";
  private mois_const : string= "Mois";
  private semaine_const : string = "Semaine";

  form: FormGroup;
  constructor(private businessService:BusinessService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.historyTypes = [this.user_const, this.chantier_const, this.client_const];
    this.sortTypes = [this.mois_const, this.semaine_const];
    this.businessService.getAllCients().subscribe(
      value => {
        this.allClients = value as Client[];
      }
      , error => {
        console.error("Business service - all clients - an error happened")
      }
    );

    this.businessService.getAllChantier().subscribe(
      value => {
        this.allChantiers = value as Chantier[];
      }, error =>{
        console.error("Business service - all chantiers - an error happened");
      }
    );

    this.businessService.getAllUser().subscribe(
      value => {
        this.allUtilisateur = value as User[];
      }, error => {
        console.error("Business service - all users - an error happened");
      }
    );
  }
  onSelectType(){

  }

  filterSemMonth(){
    let semaineAndMonth = this.businessService.getSemainesAndMonthWithTimesheetArray(this.allTimesheet);
    this.allMonth = semaineAndMonth["month"];
    this.allSemaines = semaineAndMonth["semaine"];
  }

  onSelectFilter(){
    if((this.chosenUtilisateur ||this.chosenClient || this.chosenChantier) && this.chosenSortType && this.chosenHistoryType){
      if(this.chosenHistoryType === this.user_const){
        this.businessService.getTimesheetForUser(this.chosenUtilisateur.id).subscribe(
          value => {
            this.allTimesheet = value as Timesheet[];
            this.filterSemMonth();
          }, error =>{
            console.error("Business service - timesheet by user");
          }
        )
      }else if(this.chosenHistoryType === this.chantier_const){
        this.businessService.getTimesheetForChantier(this.chosenChantier).subscribe(
          value => {
            this.allTimesheet = value as Timesheet[];
            this.filterSemMonth();
          }, error => {
            console.error("Business service - timesheet by chantier");
          }
        )
      }else if(this.chosenHistoryType == this.client_const){
        this.businessService.getTimesheetForClient(this.chosenClient).subscribe(
          value => {
            this.allTimesheet = value as Timesheet[];
            this.filterSemMonth();
          }, error =>{
            console.error("Business service - timesheet by client");
          }
        )
      }



    }
  }
}
