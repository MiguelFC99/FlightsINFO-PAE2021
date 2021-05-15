import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  statusUser:BehaviorSubject<any> = new BehaviorSubject({userName: "", usPic: ""});
  userName:string = " ";
  usPic:string = " "; 

  header:HttpHeaders = new HttpHeaders({
    'content-type': 'application/json',
    'Authorization': this.authService.getToken()
  });

  constructor(private httpClient:HttpClient, private authService:AuthService) {
    this.statusUser.subscribe((res)=>{
      this.userName = res.userName;
      this.usPic = res.usPic;
      console.log("hola",res);
    });
   
   }
  
  
  statusUs(obj:object){
    this.statusUser.next(obj);
  }

   
  getUserbyId():Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/one-us`;
    return this.httpClient.get(url,{headers: hedersIn}).toPromise();
  }

  //GETlist AddItem DeleteItem sobre lista de vuelos favoritos del usuario

  getFavoriteListUser():Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/flights_list`;
    return this.httpClient.get(url,{headers: hedersIn}).toPromise();
  }

  
  addItemFavoriteFlightsListUser(vuelo:Object):Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/favorite_list_addItm`;
    return this.httpClient.post(url,vuelo,{headers: hedersIn}).toPromise();
  }


  deleteItemFavoriteListUser(vuelo:string):Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/favorite_list_deleteItm?vueloNum=${vuelo}`;
    return this.httpClient.delete(url,{headers: hedersIn}).toPromise();
  }

  //GETList AddItem DeleteItem sobre lista de aeropuertos del usuario
  getFavAirportsListUser():Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/favAirports_list`;
    return this.httpClient.get(url,{headers: hedersIn}).toPromise();
  }

  addItemFavAirportsListUser(airport:any):Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/favAirports_list_addItm`;
    return this.httpClient.post(url,airport,{headers: hedersIn}).toPromise();
  }

  deleteItemFavAirportsListUser(codeIata:string):Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': this.authService.getToken()
    })
    const url = `${environment.apiUrl}users/favAirports_list_deleteItm?iata_code=${codeIata}`;
    return this.httpClient.delete(url,{headers: hedersIn}).toPromise();
  }

  sendFileItinerario(formData:any):Promise<any>{
    const hedersIn:HttpHeaders = new HttpHeaders({
      'Authorization': this.authService.getToken()
    })
    
    const url = `${environment.apiUrl}users/upload`;
    return this.httpClient.post(url,formData,{headers: hedersIn}).toPromise();
  }

}
