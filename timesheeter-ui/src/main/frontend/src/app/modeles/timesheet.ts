export class Timesheet{
  constructor(){
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
  numeroSemaine: number;
  debutSemaine: string;
  finSemaine: string;
  mois: string;
  annee: string;
  totalHeures : string;
}
