import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { FlightService } from 'src/app/common/services/flight.service';
import { SocketIoService } from 'src/app/common/services/socket-io.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pageAirports:number = 1;
  pageChats:number = 1;
  user: any = {
    userName: "",
    lastName: "",
    email: "",
    password: "",
    picture: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

  };

  airports: any = [];

  userChat = {
    user: '',
    text: '',
    email: '',
    image: ''
  }

  mensajesList:any;
  eventName:string = "send-message";
  iataAir = '';




  loggedIn: boolean = false;
  constructor(private authService:AuthService, private userService:UserService, private flightService:FlightService, private socketIo: SocketIoService) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(status => {
      this.loggedIn = status;
    })

    this.userService.getUserbyId().then(results => {
      console.log("resultado correcto ", results);
      this.user = results.user;
      this.userChat.user = this.user.userName;
      this.userChat.email = this.user.email;
      this.userChat.image = this.user.picture
      console.log("imagen aqui ",this.user.picture)
      this.userService.statusUs({
        userName: this.user.userName,
        usPic: this.user.picture
      })
    }).catch(err => {
      console.log("resultado incorrecto ", err);
    })

    this.flightService.getAirports().then(result=>{
      console.log("Ok lista de aeropuertos: ");
      this.airports = result;
    }).catch(err=>{
      console.log("error en lista de Aeropuertos: ",err);
    })
    

    //SOCKET
    this.socketIo.listen('text-event').subscribe((data)=>{
      this.mensajesList = data;
    })
  }


  //funciones

  addAirportFavList(dataAir:any){
    console.log(dataAir);
    this.userService.addItemFavAirportsListUser(dataAir).then(result=>{
      console.log("aeropuerto add");
      alert("se agregó a tu lista de aeropuertos");
    }).catch(err=>{
      console.log("error al agregar aeropuerto: ",err);
    })
  }

  //fncion SOCKET
  sendMessage(){
    console.log("user aqui",this.user,this.userChat);
    this.socketIo.emit(this.eventName,this.userChat)
    this.userChat.text = '';
    
  }

  buscarAero(){
    console.log(this.iataAir);
    if(this.iataAir!=" "){
      this.flightService.getOneAirports("?iata_one_airp=" + this.iataAir.toUpperCase()).then(result=>{
        console.log("Ok lista de aeropuertos: ");
        this.airports = result;
        this.iataAir = '';
        console.log(this.airports);
      }).catch(err=>{
        console.log("error en lista de Aeropuertos: ",err);
        this.iataAir = '';
        this.flightService.getAirports().then(result=>{
          console.log("Ok lista de aeropuertos: ");
          this.airports = result;
        }).catch(err=>{
          console.log("error en lista de Aeropuertos: ",err);
        })
      })
    }
  }
}
