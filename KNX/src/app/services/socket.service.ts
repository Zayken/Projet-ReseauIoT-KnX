import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from  "@angular/common/http";
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { KNXService } from './knx.service';

@Injectable({
    providedIn: 'root'
  })
export class SocketService {

    private socket;

    constructor(private http: HttpClient,private knxService:KNXService) {
        this.socket = io('http://localhost:8080');
    }

    observer
    getSocketData(): Observable<any> {
        this.socket.on('event', (res) => {
            this.observer.next(res);
            let json = JSON.parse(res);
            console.log(json);
            let tmp={lampeId:json.lampeId,status:json.status};
            if(json.ip==this.knxService.IP){
                this.knxService.lampes[json.lampeId-1]=tmp;
            }
        });
        return this.getSocketDataObservable();
    }
    getSocketDataObservable(): Observable<any> {
        return new Observable(observer => {
            this.observer = observer;
        });
    }
}