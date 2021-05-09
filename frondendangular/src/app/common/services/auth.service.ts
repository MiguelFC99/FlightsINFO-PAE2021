import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginStatus:BehaviorSubject<any> = new BehaviorSubject(false);

  constructor() {
    this.loginStatus.next(this.isLoggedIn());
   }

  isLoggedIn(){
    return !!localStorage.getItem('token') || false;
  }

  saveToken(token:string){
    localStorage.setItem('token',token);
    this.loginStatus.next(true);

  }

  getToken():any{
    return localStorage.getItem('token')?localStorage.getItem('token'): " ";
  }

  logOut(){
    localStorage.clear();
    this.loginStatus.next(false);
  }

}
