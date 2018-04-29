import {Component, ElementRef, OnInit} from '@angular/core';
import {Timesheet} from "../modeles/timesheet";
import {Client} from "../modeles/client";
import {Chantier} from "../modeles/chantier";
import {BusinessService} from "../service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {NgbDateFRParserFormatter} from "./ngv-date-fr-parser-formatter";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../modeles/User";
import {UtilService} from "../service/util.service";

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
  chantier: Chantier;
  filteredChantier: Chantier[];
  allOuvriers : User[];

  constructor(private businessService:BusinessService,
              private utilService : UtilService,
              private _eref: ElementRef) { }

  ngOnInit() {
    this.currentTimesheet = new Timesheet();
    this.currentTimesheet.chantiers = [];
    this.recordedTimesheets = [];
    this.localTimesheetId = 0;
    this.submitted = false;
    this.error = false;
    this.currentTimesheet.chantiers = [];
    this.filteredChantier = [];

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

    this.businessService.getAllUser().subscribe(
      value => {
        this.allOuvriers = value as User[];
        this.allOuvriers = this.allOuvriers.filter(x => x.active);
      }, error =>{
        console.error("Business service - all ouvrier - an error happened")
      }
    )
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

  checkInputDate(timesheet: Timesheet): boolean{
    return this.utilService.checkDate(this.utilService.formatDateForDisplay(timesheet.dateDt));
  }

  checkChantierInChantierList(){
    return this.currentTimesheet.chantiers !== null && this.currentTimesheet.chantiers.length >0;
  }
  onSubmit() {
    this.displayValidationMessage = null;
    if(!this.checkInputDate(this.currentTimesheet)){
      this.displayValidationMessage = "La date doit être encodée sous le format JJ/MM/AAAA, exemple: 01/01/2018";
      return;
    }
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

    this.currentTimesheet.ouvriersPresents = [];
    for(let ouvrier of this.allOuvriers){
      if(ouvrier.selected){
        ouvrier.selected = false;
        let user:User = new User();
        user.active = ouvrier.active;
        user.firstname = ouvrier.firstname;
        user.lastname = ouvrier.lastname;
        user.id = ouvrier.id;
        this.currentTimesheet.ouvriersPresents.push(user);
      }
    }
    this.error = false;
    this.submitted = false;
    this.displayMessage = "";
    this.displayValidationMessage = "";
    this.recordedTimesheets.push(this.currentTimesheet);
    this.currentTimesheet = new Timesheet();
    this.currentTimesheet.chantiers = [];
    this.currentTimesheet.id = this.localTimesheetId;
    this.localTimesheetId += 1;
    this.businessService.getAllChantier().subscribe(
      value => {
        this.allChantiers = value as Chantier[];
      }, error =>{
        console.error("Business service - all chantiers - an error happened")
      }
    );

  }
  onModif(timesheet:Timesheet){
    this.currentTimesheet = timesheet;
    for(let ouvrier of this.currentTimesheet.ouvriersPresents){
      for(let user of this.allOuvriers){
        if(user.id === ouvrier.id){
          user.selected = true;
        }
      }
    }
    this.recordedTimesheets = this.recordedTimesheets.filter(x => x !== timesheet);
  }

  setDates(){
    for(let timesheet of this.recordedTimesheets){
      timesheet.dateStr = this.businessService.formatDateForServer(timesheet.dateDt);
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

  onAddChantier(){
    if(this.chantier) {
      let index = this.currentTimesheet.chantiers.indexOf(this.chantier);
      let indexAllChantiers = this.allChantiers.indexOf(this.chantier);
      if (index < 0) {
        this.currentTimesheet.chantiers.push(this.chantier);
      }
      this.allChantiers.splice(indexAllChantiers, 1);
      this.chantier = null;
    }
    this.recomputeNomChantier();
  }

  displayFn(val: Chantier) {
    return val ? val.nom : val;
  }

  onChangeChantier(inputChantier:any){
    this.filteredChantier = this.allChantiers.filter(leChantier => leChantier.nom.toLowerCase().indexOf(inputChantier.toLowerCase()) > -1);
  }

  remove(unChantier: any): void {
    let index = this.currentTimesheet.chantiers.indexOf(unChantier);
    let indexAll = this.allChantiers.indexOf(unChantier);

    if (index >= 0) {
      this.currentTimesheet.chantiers.splice(index, 1);
    }
    if(indexAll < 0){
      this.allChantiers.push(unChantier);
    }
  }

  recomputeNomChantier(){

    let nomChantier = "";
    for(let chantier of this.currentTimesheet.chantiers){
      let prefix = "-";
      if(!nomChantier){
        prefix = "";
      }
      nomChantier = nomChantier + prefix + chantier.nom;
    }
    this.currentTimesheet.nomChantier = nomChantier;
  }
}
