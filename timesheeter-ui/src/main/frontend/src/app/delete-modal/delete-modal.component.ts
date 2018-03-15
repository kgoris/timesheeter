import {Component, Input, OnInit} from '@angular/core';
import {Timesheet} from "../modeles/timesheet";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DeleteModalContentComponent} from "../delete-modal-content/delete-modal-content.component";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  @Input()
  currentTimesheet:Timesheet;


  constructor(private modalService: NgbModal) {
  }
  open() {
    const modalRef: NgbModalRef = this.modalService.open(DeleteModalContentComponent);
    modalRef.componentInstance.currentTimesheet = this.currentTimesheet;
  }

  ngOnInit() {
  }

}
