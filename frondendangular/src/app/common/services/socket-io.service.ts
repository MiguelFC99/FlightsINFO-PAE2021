import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from "./../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  socketClient:any; 

  constructor() {
    this.socketClient = socketIo.io(environment.socketUrl);
   }


  listen(eventName:string){
    return new Observable((subscriber)=>{
      this.socketClient.on(eventName,(data:any)=>{
        subscriber.next(data);
      })
    })
  }

  emit(eventName:any, data:any){
    this.socketClient.emit(eventName,data);
  }

  /*connect(cb:any){
    this.socketClient = socketIo.io(environment.socketUrl);
    cb();
  }

  on(eventName:any){
    return new Promise((success)=>{
      this.socketClient.on(eventName,success);
    })
  }

  emit(eventName:any, data:any){
    this.socketClient.emit(eventName,data);
  }

  broadcast(eventName:any, data:any){

  }

  disconnect(){
    if(this.socketClient && this.socketClient.connected){
      this.socketClient.disconnect();
    }
  }*/

}
