import { Component, OnInit } from '@angular/core';
import { FlightService } from "./../../../common/services/flight.service";

@Component({
  selector: 'app-flights-list',
  templateUrl: './flights-list.component.html',
  styleUrls: ['./flights-list.component.scss']
})
export class FlightsListComponent implements OnInit {

  flightsDepList: any[] = [{
    vueloNum: "AM262",
    airLine: "AeroMexico",
    salidaTime: "10:20",
    llegadaTime: "21:20",
    destinoName: "PVR",
    status: "ok"
  },
  {
    vueloNum: "FX66",
    airLine: "FedEx",
    salidaTime: "10:12",
    llegadaTime: "14:20",
    destinoName: "MEM",
    status: "retraso"
  }];
  constructor(private flightService:FlightService) { }

  ngOnInit(): void {
  }

}
