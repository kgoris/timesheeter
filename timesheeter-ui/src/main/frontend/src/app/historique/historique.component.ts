import { Component, OnInit } from '@angular/core';
import {BusinessService} from "../service";
import {User} from "../modeles/User";
import {Chantier} from "../modeles/chantier";
import {Client} from "../modeles/client";
import {Timesheet} from "../modeles/timesheet";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Semaine} from "../modeles/Semaine";
import {NgbDateFRParserFormatter} from "../timesheet/ngv-date-fr-parser-formatter";
import * as moment from 'moment';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {

  allUtilisateur: User[];
  allChantiers: Chantier[];
  allClients: Client[];

  historyTypes: string [];
  sortTypes: string [];
  allMonth: string[];
  allSemaines: Semaine[];
  allYear: string[];
  allTimesheet: Timesheet[];
  filteredTimesheets: Timesheet[];
  chosenHistoryType: string;
  chosenSortType: string;
  chosenUtilisateur: User;
  chosenChantier: string;
  chosenClient: string;
  chosenMonth: string;
  chosenSemaine: Semaine;
  chosenYear: string;

  user_const: string = "Utilisateur";
  chantier_const: string = "Chantier";
  client_const: string = "Client";
  mois_const: string = "Mois";
  semaine_const: string = "Semaine";
  year_const: string = "Annee";

  totalHeures: string;

  form: FormGroup;

  constructor(private businessService: BusinessService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.historyTypes = [this.user_const, this.chantier_const, this.client_const];
    this.sortTypes = [this.mois_const, this.semaine_const, this.year_const];
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
      }, error => {
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

  onSelectType() {

  }

  filterSemMonthYear() {
    let timeMap = this.businessService.getSemainesMonthYearWithTimesheetArray(this.allTimesheet);
    this.allMonth = timeMap["month"];
    this.allSemaines = timeMap["semaine"];
    this.allYear = timeMap["year"];
  }
  formatDateForDisplay(timesheet:Timesheet){
    if(timesheet.dateStr.indexOf('-') >= 0){
      let dateTmp:Date = moment(timesheet.dateStr, "YYYY-MM-DD").toDate();
      timesheet.dateStr = moment(dateTmp).format('DD/MM/YYYY')
    }
    let date: any = timesheet.dateDt;
    let day = date.day;
    let month = date.month;
    if(day.length ===1){
      day = '0' + day;
    }
    if(month.length === 1){
      month = '0' + month;
    }

    return day + '/' + month + '/' + date.year;
  }

  testIfTimesheetActive(timesheet:Timesheet){
    return typeof(timesheet.active) === "undefined" || typeof(timesheet.active) !== "undefined" && timesheet.active;
  }
  displayObservations(observations:string){
    if(observations){
      return observations.slice(0,30)
    }
    return observations;
  }

  onSelectFilter() {
    if ((this.chosenUtilisateur || this.chosenClient || this.chosenChantier) && this.chosenHistoryType) {
      this.chosenMonth = null;
      this.chosenSemaine = null;
      this.chosenYear = null;
      if (this.chosenHistoryType === this.user_const) {
        this.businessService.getTimesheetForUser(this.chosenUtilisateur.id).subscribe(
          value => {
            this.allTimesheet = value as Timesheet[];
            this.filterSemMonthYear();
          }, error => {
            console.error("Business service - timesheet by user");
          }
        )
      } else if (this.chosenHistoryType === this.chantier_const) {
        this.businessService.getTimesheetForChantier(this.chosenChantier).subscribe(
          value => {
            this.allTimesheet = value as Timesheet[];
            this.filterSemMonthYear();
          }, error => {
            console.error("Business service - timesheet by chantier");
          }
        )
      } else if (this.chosenHistoryType == this.client_const) {
        this.businessService.getTimesheetForClient(this.chosenClient).subscribe(
          value => {
            this.allTimesheet = value as Timesheet[];
            this.filterSemMonthYear();
          }, error => {
            console.error("Business service - timesheet by client");
          }
        )
      }
    }
  }

  computeTotalTimesheet(timesheet: Timesheet): string{
    return this.businessService.computeHeureOneTimesheet(parseFloat(timesheet.totalHeures));
  }
  computeTotalHeures(){
    this.totalHeures = this.businessService.computeHeureAllTimesheets(this.filteredTimesheets);
  }

  formatDateTimesheet(){
    let parser:NgbDateFRParserFormatter = new NgbDateFRParserFormatter();

    this.filteredTimesheets.map(theTimesheet => {let datetmp:any = parser.parse(theTimesheet.dateStr); theTimesheet.dateDt = datetmp})
  }
  onSelectMois() {
    this.filteredTimesheets = this.businessService.filterTimesheetsByMonth(this.allTimesheet, this.chosenMonth);
    this.computeTotalHeures();
    this.formatDateTimesheet();
  }

  onSelectSemaine() {
    this.filteredTimesheets = this.businessService.filterTimesheetsBySemaine(this.allTimesheet, this.chosenSemaine);
    this.computeTotalHeures();
    this.formatDateTimesheet();
  }

  onSelectYear() {
    this.filteredTimesheets = this.businessService.filterTimesheetsByYear(this.allTimesheet, this.chosenYear);
    this.computeTotalHeures();
    this.formatDateTimesheet();
  }

}
