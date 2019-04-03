import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from  "@angular/common/http";
import { KNXService } from '../services/knx.service';
@Component({
  selector: 'app-knx',
  templateUrl: './knx.component.html',
  styleUrls: ['./knx.component.scss']
})
@Injectable()
export class KNXComponent implements OnInit {
  IPForm: FormGroup;
  errorMessage: string;
  compteur:number;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router, 
              private httpClient :HttpClient, private knxService:KNXService) {this.compteur=0;
              }

  ngOnInit() {
    this.initForm();
  }
increasecompteur()
{
if(this.compteur>=1)
{
this. compteur==1;
}
else
{
  this.compteur=this.compteur+1;

}
}
decreasecompteur()
{
if(this.compteur<=0)
{
this. compteur==0;
}
else
{
  this.compteur=this.compteur-1;

}
}
  initForm() {
    this.IPForm = this.formBuilder.group({
      IP1: ['IP1', [Validators.required]],
      IP2: ['IP2', [Validators.required]]
    });
  }

  onSubmit() {
     var IP1 = this.IPForm.get('IP1').value;
     console.log(IP1);
     var msg={"cmd":"connect", "data":{ "ip" : IP1}};
     this.knxService.ConnectToMaquette(JSON.stringify(msg));
     this.errorMessage=this.knxService.errorMessage;    
  }
}
