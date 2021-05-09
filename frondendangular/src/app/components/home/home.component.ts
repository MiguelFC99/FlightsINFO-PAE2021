import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { FlightService } from 'src/app/common/services/flight.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pageAirports:number = 1;
  user: any = {
    userName: "",
    lastName: "",
    email: "",
    password: "",
    picture: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

  };

  airports: any = [];


  loggedIn: boolean = false;
  constructor(private authService:AuthService, private userService:UserService, private flightService:FlightService) { }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(status => {
      this.loggedIn = status;
    })

    this.userService.getUserbyId().then(results => {
      console.log("resultado correcto ", results);
      this.user = results.user;
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



}
