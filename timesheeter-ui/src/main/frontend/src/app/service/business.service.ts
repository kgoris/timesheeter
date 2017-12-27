import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../modeles/timesheet";
import {Timesheets} from "../modeles/timesheets";

@Injectable()
export class BusinessService {
  private headers;

  constructor(
    private httpClient: HttpClient,
    private config: ConfigService
  ) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getAllCients(): Observable<object> {
    return this.httpClient.get(this.config.clients_url);
  }

  getAllChantier(): Observable<object>{
    return this.httpClient.get(this.config.chantiers_url);
  }

  getAllTimesheets(): Observable<object>{
    return this.httpClient.get(this.config.timesheets_url);
  }
  postRecordedTimesheets(timesheets : Timesheet[]): Observable<object>{
    let recordedTimesheets : Timesheets = new Timesheets();
    recordedTimesheets.timesheetList = timesheets;
    return this.httpClient.post(this.config.recorded_timesheets_url, recordedTimesheets, {headers: this.headers});
  }

}
