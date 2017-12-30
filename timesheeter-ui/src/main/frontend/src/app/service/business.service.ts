import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../modeles/timesheet";
import {Timesheets} from "../modeles/timesheets";
import {Semaine} from "../modeles/Semaine";
import {Time} from "@angular/common";

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

  filterIfYearAlreadyInArray(yearToCheck: string, yearArray: string[]): boolean{
    for(let year of yearArray){
      if (year === yearToCheck){
        return true;
      }
    }
    return false;
  }
  getSemainesMonthYearWithTimesheetArray(timsheets : Timesheet[]): any{
    let allSemaine: Semaine[] = [];
    let allMonth : string[] = [];
    let allYears : string [] = [];

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
      if(!this.filterIfYearAlreadyInArray(timesheet.annee, allYears)){
        allYears.push(timesheet.annee);
      }
    }

    return {
      "month" : allMonth,
      "semaine": allSemaine,
      "year": allYears,
    }
  }

  filterTimesheetsByMonth(timsheets: Timesheet[], monthWithYearToFind:string): Timesheet[]{
    let splittedMonth : string[] = monthWithYearToFind.split("/");
    let monthToFind : string = splittedMonth[0];
    let yearToFind: string = splittedMonth[1];
    let filteredTimesheets : Timesheet[] = [];

    for(let timesheet of timsheets){
      if(timesheet.mois === monthToFind && timesheet.annee === yearToFind){
        filteredTimesheets.push(timesheet);
      }
    }
    return filteredTimesheets;
  }

  filterTimesheetsBySemaine(timesheets: Timesheet[], semaineToFind: Semaine): Timesheet[]{
    let filteredTimesheets : Timesheet[] = [];
    for(let timesheet of timesheets){
      if(parseInt(timesheet.annee) === semaineToFind.annee
          && parseInt(timesheet.mois) === semaineToFind.mois
          && timesheet.numeroSemaine === semaineToFind.numeroSemaine){
        filteredTimesheets.push(timesheet);
      }
    }

    return filteredTimesheets;
  }

  filterTimesheetsByYear(timesheets: Timesheet[], yearToFind: string): Timesheet[]{
    let filteredTimesheets : Timesheet[] = [];
    for(let timesheet of timesheets){
      if(timesheet.annee === yearToFind){
        filteredTimesheets.push(timesheet);
      }
    }
    return filteredTimesheets;
  }

  computeHeureAllTimesheets(timesheets: Timesheet[]): string{
    let totalHeures : string = "0h";
    let somme : number = 0;
    for(let timesheet of timesheets){
      somme += parseFloat(timesheet.totalHeures);
    }
    return this.computeHeureOneTimesheet(somme);
  }

  computeHeureOneTimesheet(somme: number): string{
    let heures :string = Math.floor(somme).toString();
    let minutes : string = Math.round(60 * (somme % 1)).toString();
    return heures + "h" + minutes;
  }

  private compareTwoHours(left : string[], right: string[]): number{
    if(parseInt(left[0]) < parseInt(right[0])){
      return -1;
    }else if ((parseInt(left[0]) === parseInt(right[0])) && (parseInt(left[1]) < parseInt(right[1]))){
      return -1
    }else if((parseInt(left[0]) === parseInt(right[0])) && (parseInt(left[1]) === parseInt(right[1]))){
      return 0;
    }else{
      return 1;
    }
  }
  checkHours(timesheet:Timesheet):boolean{
    let separator = ":";
    if(this.compareTwoHours(timesheet.heureDebutStr.split(separator), timesheet.heureDebutPauseStr.split(separator)) >= 0){
      return false;
    }
    if(this.compareTwoHours(timesheet.heureDebutPauseStr.split(separator), timesheet.heureFinPauseStr.split(separator)) > 0){
      return false;
    }
    if(this.compareTwoHours(timesheet.heureFinPauseStr.split(separator), timesheet.heureFinStr.split(separator)) >= 0){
      return false;
    }

    return true;
  }
}
