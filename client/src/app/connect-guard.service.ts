import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { KNXService } from './services/knx.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectGuardService implements CanActivate {
 

  constructor(private router: Router, private knxService:KNXService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
if(!this.knxService.isConnect)
{
 
    this.router.navigate(['/knx']);
}
return this.knxService.isConnect;
  
}
}


