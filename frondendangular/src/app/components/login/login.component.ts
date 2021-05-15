import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';

import {
  SocialAuthService,
  GoogleLoginProvider
} from "angularx-social-login";
import {
  AuthService
} from 'src/app/common/services/auth.service';

import {
  SessionService
} from 'src/app/common/services/session.service';
import { UserService } from 'src/app/common/services/user.service';


//interfaces

interface Credentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  alert: boolean = false;
  alert2: boolean = false;

  credentials: Credentials = {
    email: '',
    password: ''
  }
  
  constructor(private socialAuthServices: SocialAuthService, private sessionService: SessionService, private authService: AuthService, private router: Router, private userService:UserService) {}

  ngOnInit(): void {
    this.socialAuthServices.authState.subscribe(user => {
      if (user) {

        console.log('Se inició sesion: ', user);
        this.sessionService.googleLogin(user.idToken).then(res => {
          this.authService.saveToken(res.token);
          console.log('Respuesta del API: ', res);
          this.router.navigate(['/home']);
        }).catch(err => {
          console.log('No se pudo iniciar sesion :c sad', err.error.err);
          if (err.error.err == 402) this.alert = true;
        })
      } else {
        console.log('No hay sesion');
      }
    })
  }



  loginByGoogle() {
    this.socialAuthServices.signIn(GoogleLoginProvider.PROVIDER_ID)
  }

  loginCredentials() {
    console.log('Credenciales', this.credentials)
    this.sessionService.loginByCredentials(this.credentials).then(res => {
      console.log('Respuesta del API', res);
      this.authService.saveToken(res.token);
      this.router.navigate(['/home']);
    }).catch(err => {
      console.log('No se pudo logear: ', err);
      if (err.error.err == 402) this.alert2 = true;
    });
  }

}