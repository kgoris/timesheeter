/**
 * Created by kevgo on 26-04-18.
 */
import {Injectable} from "@angular/core";
import moment = require("moment");

@Injectable()
export class UtilService{

  shortStringToDisplay(stringToDisplay:string):string{
    if(stringToDisplay){
      return stringToDisplay.slice(0,30)
    }
    return stringToDisplay;
  }

  checkDate(date:string): boolean{
    return moment(date, 'DD/MM/YYYY', true).isValid();
  }

  formatDateForDisplay(date:any){
    let day = date.day.toString();
    let month = date.month.toString();
    if(day.length ===1){
      day = '0' + day;
    }
    if(month.length === 1){
      month = '0' + month;
    }

    return day + '/' + month + '/' + date.year;
  }

}
