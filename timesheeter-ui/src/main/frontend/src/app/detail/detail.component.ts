import { Component, OnInit } from '@angular/core';
import {Client} from "../modeles/client";
import {BusinessService} from "../service";
import {Timesheet} from "../modeles/timesheet";
import {isBoolean} from "util";
import {UtilService} from "../service/util.service";
declare var $ : any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  allTimesheets : Timesheet[];
  constructor(private businessService: BusinessService, private utilService:UtilService) { }

  ngOnInit() {
    $.extend( $.fn.dataTableExt.oSort, {
      "date-uk-pre": function ( a ) {
        var ukDatea = a.split('/');
        return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
      },

      "date-uk-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      },

      "date-uk-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
      }
    } );
    this.businessService.getAllTimesheets().subscribe(
      value => {
        this.allTimesheets = value as Timesheet[];
        let dataSource = this.allTimesheets.map(
          x => [
            x.nomUtilisateur,
            x.nomClient,
            x.nomChantier,
            x.dateStr,
            x.heureDebutStr,
            x.heureFinStr,
            x.heureDebutPauseStr,
            x.heureFinPauseStr,
            this.utilService.shortStringToDisplay(x.observations)]);
        $('#allTimesheetId').DataTable({
          data: dataSource,

          columns: [
            { title: "Utilisateur" },
            { title: "Client" },
            { title: "Chantier" },
            { title: "date", "sType": "date-uk"  },
            { title: "Heure début" },
            { title: "Heure fin" },
            { title: "Heure début pause" },
            { title: "Heure fin pause" },
            { title: "Observations" }
          ]
        });
      }
      , error => {
        console.error("Business service - all timesheets - an error happened")
      }
    );




  }

}
