import {Component, Input, OnInit} from '@angular/core';
import {Timesheet} from "../modeles/timesheet";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BusinessService} from "../service/business.service";
import {current} from "codelyzer/util/syntaxKind";

@Component({
  selector: 'app-delete-modal-content',
  templateUrl: './delete-modal-content.component.html',
  styleUrls: ['./delete-modal-content.component.css']
})
export class DeleteModalContentComponent implements OnInit {

  @Input()
  currentTimesheet:Timesheet;

  ngOnInit() {
  }

  constructor(public activeModal: NgbActiveModal, private businessService:BusinessService ) { }

  onDismiss(){
    this.activeModal.dismiss('Cross click');
  }
  onDelete(){
    this.activeModal.close();
    this.currentTimesheet.active = false;
    this.businessService.deleteTimesheet(this.currentTimesheet).subscribe(
      value => {console.log("Deleted Timesheet")},
      error => {console.log("Timesheet not deleted"); this.currentTimesheet.active=true}
    )
  }
}
