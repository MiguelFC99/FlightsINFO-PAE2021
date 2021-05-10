import { Component, OnInit } from '@angular/core';
import { SocketIoService } from './common/services/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frondendangular';

  constructor(private socketIoService:SocketIoService){

  }

  ngOnInit(){
    /*this.socketIoService.connect(()=>{
      console.log("cliente conectado");
    });*/
  }
}
