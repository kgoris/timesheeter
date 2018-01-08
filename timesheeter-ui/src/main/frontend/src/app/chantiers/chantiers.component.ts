import { Component, OnInit } from '@angular/core';
import {Chantier} from "../modeles/chantier";
import {BusinessService} from "../service";
import {Router} from "@angular/router";
import {User} from "../modeles/User";

@Component({
  selector: 'app-chantiers',
  templateUrl: './chantiers.component.html',
  styleUrls: ['./chantiers.component.css']
})
export class ChantiersComponent implements OnInit {

  allChantiers: Chantier[];
  constructor(private businessService:BusinessService,  private router: Router) { }

  ngOnInit() {
    this.businessService.getAllChantier().subscribe(
      value => {
        this.allChantiers = value as Chantier[];
      }, error =>{
        console.error("Business service - all chantiers - an error happened")
      }
    );
  }

  onChantierClick(chantier:Chantier){
    this.router.navigate(['/chantier-detail', chantier.id]);
  }

  onNewChantier(){
    this.router.navigate(['/chantier-detail/new']);
  }

}
