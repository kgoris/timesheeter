import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Timesheet} from "../modeles/timesheet";
import {EncodingModalContentComponent} from "../encoding-modal-content/encoding-modal-content.component";

/*

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

}*/

@Component({
  selector: 'app-encoding-modal',
  templateUrl: './encoding-modal.component.html',
  styleUrls: ['./encoding-modal.component.css']
})
export class EncodingModalComponent implements OnInit {
  @Input()
  currentTimesheet:Timesheet;
  @Input()
  modification:boolean=false;

  constructor(private modalService: NgbModal) {
    console.log(this.currentTimesheet);
    console.log(this.modification);
  }
  open() {
    this.modalService.open(EncodingModalContentComponent);
  }
  ngOnInit() {
    console.log(this.currentTimesheet);
    console.log(this.modification);
  }

}
