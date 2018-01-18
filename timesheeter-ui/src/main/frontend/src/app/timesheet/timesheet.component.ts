import {Component, ElementRef, OnInit} from '@angular/core';
import {Timesheet} from "../modeles/timesheet";
import {Client} from "../modeles/client";
import {Chantier} from "../modeles/chantier";
import {BusinessService} from "../service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {NgbDateFRParserFormatter} from "./ngv-date-fr-parser-formatter";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class TimesheetComponent implements OnInit {
  currentTimesheet : Timesheet;
  recordedTimesheets : Timesheet[];
  allClients : Client[];
  allChantiers : Chantier[];
  form: FormGroup;
  dynamicId:any;
  localTimesheetId : number;
  submitted: boolean;
  displayMessage: string;
  displayValidationMessage : string;
  error : boolean;

  constructor(private businessService:BusinessService,
              private _eref: ElementRef) { }

  ngOnInit() {
    this.currentTimesheet = new Timesheet();
    this.recordedTimesheets = [];
    this.localTimesheetId = 0;
    this.submitted = false;
    this.error = false;
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
        console.error("Business service - all chantiers - an error happened")
      }
    );
  }
  searchClient = (text$: Observable<string>) => text$.debounceTime(200).distinctUntilChanged().map(term => term.length < 2 ? []
    : this.allClients.map(client => client.nom).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  searchChantier = (text$: Observable<string>) => text$.debounceTime(200).distinctUntilChanged().map(term => term.length < 2 ? []
    : this.allChantiers.map(chantier => chantier.nom).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  openDatepicker(id){
    this.dynamicId = id;
  }
  onClick(event) {

    if(this.dynamicId !== undefined && !this._eref.nativeElement.contains(event.target)) {
      let self = this;
      setTimeout(function(){
        self.dynamicId.close();
      },10);
    }
  }

  formatDateForDisplay(date:any){
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

  formatDateForServer(date:any){
    let day = date.day;
    let month = date.month;
    if(day.length ===1){
      day = '0' + day;
    }
    if(month.length === 1){
      month = '0' + month;
    }

    return date.year + '-' + month + '-' + day;
  }

  checkHours(timesheet:Timesheet):boolean{
    return this.businessService.checkHours(timesheet);
  }

  checkCustomerInCustomerList(){
    for(let client of this.allClients){
      if(client.nom === this.currentTimesheet.nomClient){
        return true;
      }
    }
    return false;
  }

  checkChantierInChantierList(){
    for(let chantier of this.allChantiers){
      if(chantier.nom === this.currentTimesheet.nomChantier){
        return true;
      }
    }
    return false;
  }
  onSubmit() {
    if (!this.checkHours(this.currentTimesheet)) {
      this.displayValidationMessage = "Erreur dans l'encodage des heures.";
      return;
    }
    if(!this.checkCustomerInCustomerList()){
      this.displayValidationMessage = "Veuillez indiquer un client valide.";
      return;
    }
    if(!this.checkChantierInChantierList()){
      this.displayValidationMessage = "Veuillez indiquer un chantier valide";
      return;
    }

    this.error = false;
    this.submitted = false;
    this.displayMessage = "";
    this.displayValidationMessage = "";

    this.recordedTimesheets.push(this.currentTimesheet);
    this.currentTimesheet = new Timesheet();
    this.currentTimesheet.id = this.localTimesheetId;
    this.localTimesheetId += 1;

  }
  onModif(timesheetId:number){
    for(let timesheet of this.recordedTimesheets){
      if(timesheet.id === timesheetId){
        this.currentTimesheet = timesheet;
        this.recordedTimesheets = this.recordedTimesheets.filter(x => x !== timesheet);
      }
    }
  }

  setDates(){
    for(let timesheet of this.recordedTimesheets){
      timesheet.dateStr = this.formatDateForServer(timesheet.dateDt);
    }
  }
  onValidate(){

    this.setDates();
    this.businessService.postRecordedTimesheets(this.recordedTimesheets).subscribe(
      () => {
        this.submitted = true;
        this.recordedTimesheets = []
        this.displayMessage = "Vos prestation ont été correctement enregistrées.";
        console.info("Business service recordedTimesheets success");
      }
      , error => {
        this.displayMessage = "Une erreur s'est produite. Veuillez en informer un administrateur.";
        this.error = true;
        this.submitted = true;
        console.error("Business service - all clients - an error happened")
      }
    )
  }

}
