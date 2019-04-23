import { Component, OnInit, Input } from '@angular/core';
import { KNXService } from '../services/knx.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  @Input() lampeId :number;
  @Input()lampeStatus:number;
  @Input()indexOfAppareil:number;
  errorMessage:string;
  lampes=<any>[];

  
  constructor(private knxService :KNXService) { }

  ngOnInit() {
    this.lampes=this.knxService.lampes;
  }
  getStatus(){
    if(this.lampeStatus==1)
    {
      return "Led "+this.lampeId +" allumée";
    }
    else
    {
    return "Led "+this.lampeId +" éteinte";  }
  }
  click()
  {
    var msg;

    if(this.lampeStatus==0)
    {
      msg={"cmd":"lightOn", "data":{ "ip" : this.knxService.IP, "lampId":this.lampeId, "state":1}};

      this.knxService.switchLight(JSON.stringify(msg),this.indexOfAppareil);
      
    }
    else
    {
      msg={"cmd":"lightOff", "data":{ "ip" : this.knxService.IP, "lampId":this.lampeId, "state":0}};

      this.knxService.switchLight(JSON.stringify(msg),this.indexOfAppareil);

    }
    this.errorMessage=this.knxService.errorMessage;
    /*if(this.lampeStatus===1)
    {this.lampeStatus=0}
    else
    {
      this.lampeStatus=1;
    }*/
  }
    geturl()
    {
      if(this.lampeStatus==1)
      {
        return "assets/light-bulb.png";
      }
      else
      {
        return "assets/light-off.png";
      }
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
 /* onSwitchOn()
  {
 this.knxService.switchOnOne(this.indexOfAppareil);
 this.errorMessage=this.knxService.errorMessage;
  }
  onSwitchOff()
  {
  this.knxService.switchOffOne(this.indexOfAppareil);
  this.errorMessage=this.knxService.errorMessage;

  }*/

}
