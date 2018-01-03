import { Component, OnInit } from '@angular/core';
import {BusinessService} from "../service";
import {Router} from "@angular/router";
import {Client} from "../modeles/client";
import {Chantier} from "../modeles/chantier";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  private allClients : Client[];

  constructor(private businessService:BusinessService,  private router: Router) { }

  ngOnInit() {
    this.businessService.getAllCients().subscribe(
      value => {
        this.allClients = value as Client[];
      }
      , error => {
        console.error("Business service - all clients - an error happened")
      }
    );
  }

  onClientClick(client:Client){
    this.router.navigate(['/client-detail', client.id]);
  }

  onNewClient(){
    this.router.navigate(['/client-detail/new']);
  }

}
