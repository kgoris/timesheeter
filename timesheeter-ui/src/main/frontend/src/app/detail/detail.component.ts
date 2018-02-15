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

  allTimesheets : Timesheet[];
  constructor(private businessService: BusinessService) { }

  ngOnInit() {
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
            x.observations]);
        $('#allTimesheetId').DataTable({
          data: dataSource,
          columns: [
            { title: "Utilisateur" },
            { title: "Client" },
            { title: "Chantier" },
            { title: "date" },
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
