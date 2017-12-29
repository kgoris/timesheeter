import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../modeles/timesheet";
import {Timesheets} from "../modeles/timesheets";
import {Semaine} from "../modeles/Semaine";

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

  getAllUser(): Observable<object>{
    return this.httpClient.get(this.config.users_url);
  }

  getTimesheetForUser(userId: number){
    return this.httpClient.get(this.config.timesheet_user + userId);
  }

  getTimesheetForChantier(nomChantier: string){
    return this.httpClient.get(this.config.timesheet_chantier + nomChantier);
  }

  getTimesheetForClient(nomClient: string){
    return this.httpClient.get(this.config.timesheet_client + nomClient);
  }

  filterIfSemaineAlreadyInArray(semaineToCheck: Semaine, semaineArray: Semaine[]): boolean{
    for(let semaineInArray of semaineArray){
      if(semaineToCheck.numeroSemaine === semaineInArray.numeroSemaine
          && semaineToCheck.annee === semaineInArray.annee
          && semaineToCheck.mois === semaineInArray.mois){
        return true;
      }
    }
    return false;
  }

  filterIfMonthAlreadyInArray(monthToCheck: string, monthArray: string[]):boolean{
    for(let month of monthArray){
      if(month === monthToCheck){
        return true;
      }
    }
    return false;
  }

  getSemainesAndMonthWithTimesheetArray(timsheets : Timesheet[]): any{
    let allSemaine: Semaine[] = [];
    let allMonth : string[] = [];
    for (let timesheet of timsheets){
      let semaine:Semaine = new Semaine();
      semaine.debutSemaine = timesheet.debutSemaine;
      semaine.finSemaine = timesheet.finSemaine;
      semaine.numeroSemaine = timesheet.numeroSemaine;
      semaine.mois = parseInt(timesheet.mois);
      semaine.annee = parseInt(timesheet.annee);

      let month = semaine.mois + "/" + semaine.annee;
      if(!this.filterIfSemaineAlreadyInArray(semaine, allSemaine)){
        allSemaine.push(semaine);
      }
      if(!this.filterIfMonthAlreadyInArray(month, allMonth)){
        allMonth.push(month);
      }

    }
    return {
      "month" : allMonth,
      "semaine": allSemaine
    }
  }


}
