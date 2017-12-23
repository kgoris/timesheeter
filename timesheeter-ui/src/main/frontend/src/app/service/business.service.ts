import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class BusinessService {

  constructor(
    private httpClient: HttpClient,
    private config: ConfigService
  ) { }

  getAllCients(): Observable<object> {
    return this.httpClient.get(this.config.clients_url);
  }

  getAllChantier(): Observable<object>{
    return this.httpClient.get(this.config.chantiers_url);
  }

}
