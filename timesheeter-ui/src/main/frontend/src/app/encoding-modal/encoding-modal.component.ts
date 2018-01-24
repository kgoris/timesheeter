import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Timesheet} from "../modeles/timesheet";
import {EncodingModalContentComponent} from "../encoding-modal-content/encoding-modal-content.component";


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
  }
  open() {
    const modalRef: NgbModalRef = this.modalService.open(EncodingModalContentComponent);
    modalRef.componentInstance.currentTimesheet = this.currentTimesheet;
    modalRef.componentInstance.modification = this.modification;
  }


  ngOnInit() {
  }

}
