import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {Timesheet} from "../modeles/timesheet";
import {BusinessService} from "../service/business.service";
import {NgbDateFRParserFormatter} from "../timesheet/ngv-date-fr-parser-formatter";
import {Client} from "../modeles/client";
import {Chantier} from "../modeles/chantier";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-encoding-modal-content',
  templateUrl: './encoding-modal-content.component.html',
  styleUrls: ['./encoding-modal-content.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class EncodingModalContentComponent implements OnInit {
  @Input()
  currentTimesheet:Timesheet;
  @Input()
  modification:boolean=false;
  dynamicId:any;

  allClients: Client[];
  allChantiers: Chantier[];

  constructor(public activeModal: NgbActiveModal,
              private _eref: ElementRef,
              private businessService:BusinessService) { }

  ngOnInit() {
    if(this.currentTimesheet && this.currentTimesheet.dateStr){
      let parser: NgbDateFRParserFormatter = new NgbDateFRParserFormatter();
      let date : any = parser.parse(this.currentTimesheet.dateStr);
      this.currentTimesheet.dateDt = date;
    }
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

  onDismiss(){
    this.activeModal.dismiss('Cross click');
  }

  onClose(){
    if(this.currentTimesheet){
      this.currentTimesheet.dateStr = this.businessService.formatDateForServer(this.currentTimesheet.dateDt);
      this.businessService.updateTimesheet(this.currentTimesheet).subscribe();
    }
    this.activeModal.close('Close click')
  }

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

  searchClient = (text$: Observable<string>) => text$.debounceTime(200).distinctUntilChanged().map(term => term.length < 2 ? []
    : this.allClients.map(client => client.nom).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  searchChantier = (text$: Observable<string>) => text$.debounceTime(200).distinctUntilChanged().map(term => term.length < 2 ? []
    : this.allChantiers.map(chantier => chantier.nom).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
}
