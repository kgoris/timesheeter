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


  constructor(private businessService:BusinessService,
              private formBuilder: FormBuilder,
              private _eref: ElementRef) { }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.currentTimesheet = new Timesheet();
    this.recordedTimesheets = [];
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

  formatDate(date:any){
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
  onAdd(){
    this.recordedTimesheets.push(this.currentTimesheet);
    this.currentTimesheet = new Timesheet();
  }
  onModif(nomClient:string){
    /*
    TODO: générer un id par timesheet!!!
     */
    for(let timesheet of this.recordedTimesheets){
      if(timesheet.nomClient === nomClient){
        this.currentTimesheet = timesheet;
        this.recordedTimesheets = this.recordedTimesheets.filter(x => x !== timesheet);
      }
    }
  }
}
