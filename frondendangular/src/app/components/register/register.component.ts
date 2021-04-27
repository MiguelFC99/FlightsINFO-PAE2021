import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  formReg: FormGroup = this.formBuilder.group({
    nombre:  ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmpass: ['', [Validators.required, Validators.minLength(8)]]
  },{
    validators:  ()=>{
      if(!this.formReg)return;
      if(this.formReg.controls.password.value == this.formReg.controls.confirmpass.value){
        return null;
      } else{
        return {
          confirmPassword: true
        }
      }
     }
    
  })


  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    
  }

  formRegister(){
    console.log('entra a la funcion')
    if(this.formReg.valid){
      console.log('form valido');
    }else{
      console.log('faltan datos');
    }
    
  }
}
