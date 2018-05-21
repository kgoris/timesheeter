import {Component, OnInit, ViewChild} from '@angular/core';
import {BusinessService} from "../service/business.service";
import {UserService} from "../service/user.service";
import {Timesheet} from "../modeles/timesheet";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {UtilService} from "../service/util.service";
import {NgbDateFRParserFormatter} from "../timesheet/ngv-date-fr-parser-formatter";

@Component({
  selector: 'app-userhistorical',
  templateUrl: './userhistorical.component.html',
  styleUrls: ['./userhistorical.component.css']
})
export class UserhistoricalComponent implements OnInit {

  allTimesheet : Timesheet[];
  displayedColumns = ['nomClient', 'nomChantier',
                      'dateStr', 'heureDebutStr', 'heureFinStr',
                      'heureDebutPauseStr', 'heureFinPauseStr',
                      'observation'];
  dataSource :MatTableDataSource<Timesheet>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private businessService: BusinessService,
              private userService:UserService,
              private utilService: UtilService) { }

  ngOnInit() {
    if(this.userService.currentUser){
      this.businessService.getTimesheetForUser(this.userService.currentUser.id).subscribe(
        value => {
          this.allTimesheet = value as Timesheet[];

          let parser:NgbDateFRParserFormatter = new NgbDateFRParserFormatter();

          this.allTimesheet.map(theTimesheet => {let datetmp:any = parser.parse(theTimesheet.dateStr); theTimesheet.dateDt = datetmp})
          this.dataSource = new MatTableDataSource<Timesheet>(this.allTimesheet);
          this.dataSource.paginator = this.paginator;
        }, error => {
          console.error("Business service - timesheet by user");
        }
      )
    }
  }

  shortString(aString:string): string{
    return this.utilService.shortStringToDisplay(aString);
  }
  computeTotalTimesheet(timesheet: Timesheet): string{
    return this.businessService.computeHeureOneTimesheet(parseFloat(timesheet.totalHeures));
  }

}
