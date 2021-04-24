import { Component, OnInit } from '@angular/core';

import { SocialAuthService, GoogleLoginProvider } from "angularx-social-login";
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socualAuthServices:SocialAuthService, private sessionService:SessionService) { }

  ngOnInit(): void {
    console.log("hola 1")
    this.socualAuthServices.authState.subscribe(user =>{
      if(user){
        
        console.log('Se inició sesion: ', user);
        this.sessionService.googleLogin(user.idToken).then(res => {
          console.log('Respuesta del API: ', res);
        }).catch(err => {
          console.log('No se pudo iniciar sesion');
        })
      }
      else{
        console.log('No hay sesion');
      }
    })
  }



  googleLogin(){
    this.socualAuthServices.signIn(GoogleLoginProvider.PROVIDER_ID)
  }


}
