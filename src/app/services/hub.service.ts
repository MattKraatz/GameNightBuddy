import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { ServerConfig } from '../constants/serverConfig';

@Injectable()
export class HubService {

  private socket;

  constructor() {
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
    console.log("MESSAGE SENT");
  }

  startConnection() {
    let observable = new Observable(observer => {
      this.socket = io(ServerConfig.signalrUrl + '/user');
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

}
