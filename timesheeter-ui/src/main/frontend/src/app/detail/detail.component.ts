import { Component, OnInit } from '@angular/core';
import {Client} from "../modeles/client";
import {BusinessService} from "../service";
import {Timesheet} from "../modeles/timesheet";
declare var $ : any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  private allTimesheets : Timesheet[];
  constructor(private businessService: BusinessService) { }

  ngOnInit() {
    this.businessService.getAllTimesheets().subscribe(
      value => {
        this.allTimesheets = value as Timesheet[];
        $('#allTimesheetId').DataTable({
          data: this.allTimesheets,
        });
        console.info("ok")
      }
      , error => {
        console.error("Business service - all timesheets - an error happened")
      }
    );




  }

}
