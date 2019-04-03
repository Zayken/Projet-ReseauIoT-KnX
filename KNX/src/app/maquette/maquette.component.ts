import { Component, OnInit, Input } from '@angular/core';
import { KNXService } from '../services/knx.service';
import { KNXComponent } from '../knx/knx.component';

@Component({
  selector: 'app-maquette',
  templateUrl: './maquette.component.html',
  styleUrls: ['./maquette.component.scss']
})
export class MaquetteComponent implements OnInit {
  @Input() lampeId :number;
  @Input()lampeStatus:number;
  @Input()indexOfAppareil:number;
 errorMessage:string;
  constructor(private knxService :KNXService) { }

  ngOnInit() {
  }
  getStatus(){
    return this.lampeStatus;
  }
  getid(){
    return this.lampeId;
  }
  getColor()
  {
    if(this.lampeStatus===1)
    {
      return "green";
    }
      else if (this.lampeStatus===0)
      {
        return "red";
      }
  
  }
  /*onSwitchOn()
  {
    console.log(this.lampeId);
    var msg={ip:this.knxService.IP,lampeId:this.indexOfAppareil};
 this.knxService.switchOnOne(this.indexOfAppareil);
 this.errorMessage=this.knxService.errorMessage;
  }
  onSwitchOff()
  {
  this.knxService.switchOffOne(this.indexOfAppareil);
  this.errorMessage=this.knxService.errorMessage;

  }*/
}
