import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { KNXService } from '../services/knx.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../services/socket.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
 speedForm: FormGroup;
 @ViewChild('order1') order1: ElementRef;
 @ViewChild('order2') order2: ElementRef;
 @ViewChild('order3') order3: ElementRef;
 @ViewChild('order4') order4: ElementRef;

 isChenillard:boolean;
 appareilSubscription : Subscription;
  constructor(private formBuilder: FormBuilder,private socketDataService: SocketService,private httpClient:HttpClient,private knxService:KNXService) {}

  ngOnInit() {
   this.IP=this.knxService.IP;
    this.lampes=this.knxService.lampes;
    this.getSocketData();
    this.initForm();
    this.isChenillard=false;
    }

    initForm() {
      this.speedForm = this.formBuilder.group({
        initspeed: ['speed', [Validators.required]],
      });
    }
    
    getSocketData(): void {
      this.sub = this.socketDataService.getSocketData()
        .subscribe(data => {
         this.socketData = data
      })
    }
    onSubmit() {
      var speed = this.speedForm.get('initspeed').value;
      console.log("speed : "+speed);
      var msg={"cmd":"setSpeed", "data":{ "ip" : this.IP, "speed":speed}};
      this.knxService.setSpeed(JSON.stringify(msg));
   }

    increase()
    {
      console.log("j'increase");
      var msg={"cmd":"increase", "data":{ "ip" : this.IP, "speed":150}};

      this.knxService.increase(JSON.stringify(msg));
    }
    decrease()
    {
      console.log("je decrease");

      var msg={"cmd":"decrease", "data":{ "ip" : this.IP, "speed":150}};

      this.knxService.decrease(JSON.stringify(msg));
    }
    setOrder()
    {
      console.log("change ordre");
      let tab=[this.order1.nativeElement.value,this.order2.nativeElement.value,this.order3.nativeElement.value,this.order4.nativeElement.value]
      var msg={"cmd":"changeOrder", "data":{ "ip" : this.IP, "order":tab}};

      this.knxService.setOrder(JSON.stringify(msg));
    }
   
 disconnect()
 {
   var msg={"cmd":"disconnect","data":{"ip":this.IP}};
  this.knxService.DisconnectFromMaquette(JSON.stringify(msg));
 }
chenillard()
{
  if(this.isChenillard==false)
  {
    var msg={"cmd":"start", "data":{ "ip" : this.IP}};

  }
  else if(this.isChenillard==true)
  {
  var msg={"cmd":"stop", "data":{ "ip" : this.IP}};
  }

 
  this.httpClient.post("http://localhost:3000/chenillard",msg,{responseType: 'text'})
    .subscribe(
       (res)=> {
         console.log(JSON.stringify(res));
         var json=JSON.parse(res);
         if(json.check==1&&json.cmd=="start")
         {
       this.isChenillard=true;
       console.log("je veux allumer le chenillard");
         }
         else if(json.check==1&&json.cmd=="stop")
         {
           this.isChenillard=false;
           console.log("je veux eteindre le chenillard"); 
         }
       },
       (error)=>{
 
       }
     )
   console.log("statut : "+this.isChenillard);
}

getChenillard()
{
  if(this.isChenillard==true)
  {
    return "Stop chenillard";
  }
  else if(this.isChenillard==false)
  {
    return "Start chenillard";
  }
}

}
