import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient:HttpClient) { }


  googleLogin(idToken:string):Promise<any>{
    const url = `${environment.apiUrl}auth/googlelog`;
    return this.httpClient.post(url,{idToken: idToken}).toPromise();
  }

  loginByCredentials(userCred:any):Promise<any>{
    const url = `${environment.apiUrl}auth/login`
    return this.httpClient.post(url,userCred).toPromise();
  }


  googleRegister(idToken:string):Promise<any>{
    const url = `${environment.apiUrl}auth/googlereg`;
    return this.httpClient.post(url,{idToken: idToken}).toPromise();
  }

  registerByCredentials(userCred:any):Promise<any>{
    const url = `${environment.apiUrl}auth/register`;
    return this.httpClient.post(url,userCred).toPromise();
  }
}
