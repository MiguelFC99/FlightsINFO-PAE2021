import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators,FormControl } from '@angular/forms';
import { AuthService } from 'src/app/common/services/auth.service';
import { UserService } from 'src/app/common/services/user.service';
import { FlightService } from "./../../../common/services/flight.service";

@Component({
  selector: 'app-flights-list',
  templateUrl: './flights-list.component.html',
  styleUrls: ['./flights-list.component.scss']
})
export class FlightsListComponent implements OnInit {

  pageActual:number = 1;
  inputBuscar:boolean = false;

  flightsDepList: any[] = [];

  
  formSearch: FormGroup = this.formBuilder.group({
    codeVorIATA:  new FormControl('1'),
    buscar: ['', Validators.required],
    depArr: new FormControl('1')
  })

  loggedIn:boolean = false;

  constructor(private formBuilder:FormBuilder, private flightService:FlightService,private userService:UserService,private authService:AuthService) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(status => {
      this.loggedIn = status;
    })

    this.flightService.getFlightsByDep("?dep_iata=GDL").then(fListDep=>{
      this.flightsDepList = fListDep;  
    }).catch(err =>{
      console.log("error al cargar los vuelos" + err);
    });
  }


  //// funciones
  key:string = 'vueloNum';
  reverse:boolean = false;
  sort(key:string){
    this.key = key;
    this.reverse = !this.reverse;
  }

  formBuscar(){
    console.log('entra a la funcion',)

    if(this.formSearch.valid){
      let data = this.formSearch.value;
      if(data.codeVorIATA == '1' && data.depArr =='1'){
        console.log("?dep_iata="+ data.buscar.toUpperCase());
        this.flightService.getFlightsByDep("?dep_iata="+ data.buscar.toUpperCase()).then(result=>{
          this.flightsDepList = result;
        }).catch(err=>{
          console.log(err);
        });
      }else if(data.codeVorIATA == '1' && data.depArr =='0'){
        console.log("?arr_iata="+ data.buscar.toUpperCase());
        this.flightService.getFlightsByArr("?arr_iata="+ data.buscar.toUpperCase()).then(result=>{
          this.flightsDepList = result;
        }).catch(err=>{
          console.log(err);
        });
      }else{
        console.log("?flight_iata="+ data.buscar.toUpperCase());
        this.flightService.getFlightsByCode("?flight_iata="+ data.buscar.toUpperCase()).then(result=>{
          this.flightsDepList = result;
        }).catch(err=>{
          console.log(err);
        });
      }
      
    }else{
      this.inputBuscar = true;
      setTimeout(() => {
        console.log('faltan datos');
        this.inputBuscar = false;
      }, 7000);
    }
    
  }

  addItmFList(item:any){
    console.log(item);
    let newItem = {
      vueloNum: item.vueloNum,
      salidaTime: item.salidaTime,
      llegadaTime: item.llegadaTime,      
      airLine: item.airLine,
      destinoName:item.destinoName,
      
    }
    this.userService.addItemFavoriteFlightsListUser(newItem).then(result=>{
      console.log("respuesta al guardar vuelo: ",result);
    }).catch(err=>{
      console.log("ocurrio un error al guardar", err);
    })
  }


}
