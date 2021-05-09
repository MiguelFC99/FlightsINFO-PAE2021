import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import {
  SocialAuthService,
  GoogleLoginProvider
} from "angularx-social-login";
import {
  SessionService
} from 'src/app/common/services/session.service';
import {
  Router
} from '@angular/router';
import {
  AuthService
} from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  alert: boolean = false;
  alert2: boolean = false;

  formReg: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmpass: ['', [Validators.required, Validators.minLength(8)]]
  }, {
    validators: () => {
      if (!this.formReg) return;
      if (this.formReg.controls.password.value == this.formReg.controls.confirmpass.value) {
        return null;
      } else {
        return {
          confirmPassword: true
        }
      }
    }

  })


  constructor(private formBuilder: FormBuilder, private socialAuthServices: SocialAuthService, private sessionService: SessionService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.socialAuthServices.authState.subscribe(user => {
      if (user) {

        console.log('Registrar con google: ', user);
        this.sessionService.googleRegister(user.idToken).then(res => {
          console.log('Respuesta del API', res);
          this.authService.saveToken(res.token);
          this.router.navigate(['/home']);
        }).catch(err => {
          console.log('No se pudo iniciar sesion :c sad', err.error.err);
          if (err.error.err == 402) this.alert = true;
        })
      } else {
        console.log('Error Registro');
      }
    })
  }

  formRegister() {
    console.log('entra a la funcion')
    if (this.formReg.valid) {
      let data = this.formReg.value;
      let dataUs = {
        userName: data.nombre,
        lastName: data.apellido,
        email: data.email,
        password: data.password
      }
      console.log('form valido', dataUs);
      this.sessionService.registerByCredentials(dataUs).then(res => {
        console.log('Respuesta del API', res);
        this.authService.saveToken(res.token);
        this.router.navigate(['/home']);
      }).catch(err => {
        console.log('No se pudo logear: ', err);
      if (err.error.err == 402) this.alert2 = true;
      })
    } else {
      console.log('faltan datos');
    }

  }

  registerByGoogle() {
    this.socialAuthServices.signIn(GoogleLoginProvider.PROVIDER_ID)
  }



}