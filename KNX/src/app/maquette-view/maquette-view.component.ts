import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { KNXService } from '../services/knx.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-maquette-view',
  templateUrl: './maquette-view.component.html',
  styleUrls: ['./maquette-view.component.scss']
})
export class MaquetteViewComponent implements OnInit {
 IP:string;
 lampes=<any>[];
 sub: Subscription;
 socketData;
 appareilSubscription : Subscription;
  constructor(private socketDataService: SocketService,private httpClient:HttpClient,private knxService:KNXService) {}

  ngOnInit() {
   this.IP=this.knxService.IP;
    this.lampes=this.knxService.lampes;
    this.getSocketData();
    }

    getSocketData(): void {
      this.sub = this.socketDataService.getSocketData()
        .subscribe(data => {
         this.socketData = data
      })
    }
 disconnect()
 {
   var msg={"cmd":"disconnect","data":{"ip":this.IP}};
  this.knxService.DisconnectFromMaquette(JSON.stringify(msg));
 }
startchenillard()
{
  var msg={"cmd":"start", "data":{ "ip" : this.IP}};
  this.knxService.startChenillard(JSON.stringify(msg));
}



}
