import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient:HttpClient) { }


  googleLogin(idToken:string):Promise<any>{
    const url = `${environment.apiUrl}users/auth/google`;
    return this.httpClient.post(url,{idToken: idToken}).toPromise();
  }
}
