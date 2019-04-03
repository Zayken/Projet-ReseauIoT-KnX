import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { KNXService } from '../services/knx.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-maquette-view',
  templateUrl: './maquette-view.component.html',
  styleUrls: ['./maquette-view.component.scss']
})
export class MaquetteViewComponent implements OnInit {
 IP:string;
 lampes=<any>[];
 
 appareilSubscription : Subscription;
  constructor(private httpClient:HttpClient,private knxService:KNXService) {}

  ngOnInit() {
   this.IP=this.knxService.IP;
this.lampes=this.knxService.lampes;


    }
 disconnect()
 {
   var msg={"cmd":"disconnect","data":{"ip":this.IP}};
  this.knxService.DisconnectFromMaquette(JSON.stringify(msg));
 }
startchenillard()
{
var msg={ip:this.IP,data:"chenillard"};
this.knxService.startChenillard(JSON.stringify(msg));
}
startrequete()
{
  this.knxService.startrequete();
}

}
