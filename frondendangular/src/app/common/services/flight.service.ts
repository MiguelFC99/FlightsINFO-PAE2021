import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private httpClient:HttpClient) { }


  getFlightsByArr(arriata:string):Promise<any>{
    const url = environment.apiUrl+"flights/flightsArr"+arriata;
    return this.httpClient.get(url).toPromise();
  }

  getFlightsByDep(depiata:string):Promise<any>{
    const url = environment.apiUrl+"flights/flightsDep"+depiata;  
    return this.httpClient.get(url).toPromise();
  }

  getFlightsByCode(codeFlig:string):Promise<any>{
    const url = environment.apiUrl+"flights/flightsCode"+codeFlig; 
    return this.httpClient.get(url).toPromise(); 
  }

  getAirports():Promise<any>{
    const url = environment.apiUrl+"flights/airportsArr"; 
    return this.httpClient.get(url).toPromise(); 
  }

  getOneAirports(iataCodeAir:string):Promise<any>{
    const url = environment.apiUrl+"flights/airport"+iataCodeAir;
    return this.httpClient.get(url).toPromise();
  }
}
