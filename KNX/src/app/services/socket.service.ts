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
            console.log(res.toString());
            this.observer.next(res);
            let json = JSON.parse(res);
            this.knxService.lampes[json.lampeId-1]=json;
        });
        return this.getSocketDataObservable();
    }
    getSocketDataObservable(): Observable<any> {
        return new Observable(observer => {
            this.observer = observer;
        });
    }
}