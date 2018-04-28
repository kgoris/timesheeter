/**
 * Created by kevgo on 26-04-18.
 */
import {Injectable} from "@angular/core";

@Injectable()
export class UtilService{

  shortStringToDisplay(stringToDisplay:string):string{
    if(stringToDisplay){
      return stringToDisplay.slice(0,30)
    }
    return stringToDisplay;
  }
}
