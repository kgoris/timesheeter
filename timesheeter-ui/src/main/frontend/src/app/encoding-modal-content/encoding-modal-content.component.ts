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
  displayValidationMessage :string;
  allClients: Client[];
  allChantiers: Chantier[];
  chantier: string;
  chantierChoisis: Chantier[];

  constructor(public activeModal: NgbActiveModal,
              private _eref: ElementRef,
              private businessService:BusinessService) { }

  ngOnInit() {
    this.chantierChoisis = [];

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

    if(this.currentTimesheet && this.currentTimesheet.chantiers){
      this.chantierChoisis = this.currentTimesheet.chantiers;
    }
  }

  onDismiss(){
    this.activeModal.dismiss('Cross click');
  }
  checkCustomerInCustomerList(){
    for(let client of this.allClients){
      if(client.nom === this.currentTimesheet.nomClient){
        return true;
      }
    }
    return false;
  }
  checkHours(timesheet:Timesheet):boolean{
    return this.businessService.checkHours(timesheet);
  }
  checkChantierInChantierList(){
    return this.chantierChoisis !== null && this.chantierChoisis.length >0;

  }
  onClose(){
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
    if(this.currentTimesheet){
      this.currentTimesheet.dateStr = this.businessService.formatDateForServer(this.currentTimesheet.dateDt);
      this.currentTimesheet.chantiers = this.chantierChoisis;
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

  private findChantier(nomchantier:string):Chantier{
    return this.allChantiers.find(x => x.nom === nomchantier);
  }
  onAddChantier(){
    if(this.chantier) {
      let chantierObj : Chantier = this.findChantier(this.chantier);
      let index = this.chantierChoisis.indexOf(chantierObj);
      let indexAllChantiers = this.allChantiers.indexOf(chantierObj);
      if (index < 0) {
        this.chantierChoisis.push(chantierObj);
      }
      this.allChantiers.splice(indexAllChantiers, 1);
      this.chantier = null;
    }
  }

  remove(unChantier: any): void {
    let index = this.chantierChoisis.indexOf(unChantier);

    if (index >= 0) {
      this.chantierChoisis.splice(index, 1);
    }
  }


}
