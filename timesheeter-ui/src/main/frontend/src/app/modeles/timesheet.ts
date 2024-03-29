import {Chantier} from "./chantier";
import {User} from "./User";
export class Timesheet{
  constructor(){
    this.active = true;
  }
  id: number;
  dateStr: string;
  dateDt : Date;
  heureDebutStr : string;
  heureFinStr : string;
  heureDebutPauseStr: string;
  heureFinPauseStr: string;
  nomClient: string;
  nomChantier: string;
  nomUtilisateur: string;
  idUser:number;
  numeroSemaine: number;
  debutSemaine: string;
  finSemaine: string;
  mois: string;
  annee: string;
  totalHeures : string;
  observations: string;
  chantiers:Chantier[];
  ouvriersPresents: User[];
  active: boolean;
  facturee: boolean;
}
