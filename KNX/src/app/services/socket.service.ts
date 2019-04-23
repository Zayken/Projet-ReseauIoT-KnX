import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from  "@angular/common/http";
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'

@Injectable({
    providedIn: 'root'
  })
export class SocketService {

    private socket;

    constructor(private http: HttpClient) {
        this.socket = io('http://localhost:8080');
    }

    observer
    getSocketData(): Observable<any> {
        this.socket.on('event', (res) => {
            this.observer.next(res);
        });
        return this.getSocketDataObservable();
    }
    getSocketDataObservable(): Observable<any> {
        return new Observable(observer => {
            this.observer = observer;
        });
    }
}