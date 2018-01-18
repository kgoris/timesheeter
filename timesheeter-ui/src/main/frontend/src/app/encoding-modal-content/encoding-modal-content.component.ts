import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Timesheet} from "../modeles/timesheet";

@Component({
  selector: 'app-encoding-modal-content',
  templateUrl: './encoding-modal-content.component.html',
  styleUrls: ['./encoding-modal-content.component.css']
})
export class EncodingModalContentComponent implements OnInit {
  @Input()
  currentTimesheet:Timesheet;
  @Input()
  modification:boolean=false;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.currentTimesheet);
    console.log(this.modification);
  }

  onDismiss(){
    this.activeModal.dismiss('Cross click');
  }

  onClose(){
    this.activeModal.close('Close click');
  }

}
