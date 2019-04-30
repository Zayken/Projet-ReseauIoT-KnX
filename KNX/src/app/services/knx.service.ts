import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  "@angular/common/http";
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { isComponent } from '@angular/core/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class KNXService {
  appareilSubject = new Subject<any[]>();
   lampes;

   IP;
   isConnect:boolean;
   errorMessage:string;


  constructor(private httpClient: HttpClient, private router :Router) {      

//requete HTTP pour savoir si la connexion est toujours maintenue

}
  ngOnInit()
  {
  }

  emitAppareilSubject()
  {
    this.appareilSubject.next(this.lampes.slice());
  }
  switchOnAll()
  {
    for (let appareil of this.lampes)
    {
      appareil.status=1;
    }
    this.emitAppareilSubject();
  }
  switchOffAll()
  {
    for (let appareil of this.lampes)
    {
      appareil.status=0;
    }
    this.emitAppareilSubject();

  }
  switchLight(data :string,index:number)
  {
   
    this.httpClient.post("http://localhost:3000/lightState",data,{responseType: 'text'})
    .subscribe(
       (res)=> {
         var json=JSON.parse(res);
         console.log(JSON.stringify(res));
      if(json.check==1)
      {console.log("lightstate");       
      }
      else
        {
          this.errorMessage="Veuiller réessayer";
        }
     
       }
       ,
       (error)=>{
 
   console.log("erreur de suavegarde"+ error.message);
   this.errorMessage=error.message;
       }
     )

  }


    getAppareilById(id : number)
    {
      const appareil=this.lampes.find(
        (appareilObject)=>{
          return appareilObject.lampeId==id;
        }
      );
      return appareil;
    }
  
  
    
 

  ConnectToMaquette(data:string)
  {
   this.httpClient.post("http://localhost:3000/connect",data,{responseType: 'text'})
   .subscribe(
      (res)=> {
        console.log(JSON.stringify(res));
        var json=JSON.parse(res);
        if(json.check==1)
        {
          this.IP=JSON.parse(data).data.ip;
          console.log(this.IP);
          this.lampes=json.lampes;
          this.router.navigate(['maquette']);
          this.isConnect=true;
        }
        else
        {
          console.log("Connection refusé");
          this.errorMessage="Veuillez vérifier l'IP de la maquette";
          this.isConnect=false;
        }
      },
      (error)=>{

  console.log("erreur de suavegarde"+ error.message);
  this.errorMessage=error.message;
      }
    )
  }
  DisconnectFromMaquette(data:string)
  {
   this.httpClient.post("http://localhost:3000/disconnect",data,{responseType: 'text'})
   .subscribe(
      (res)=> {
        var json=JSON.parse(res);
        console.log(JSON.stringify(res));
     if(json.state==1)
     {
       this.router.navigate(['knx']);
       this.isConnect=false;
     }
    
      },
      (error)=>{

  console.log("erreur de suavegarde"+ error.message);
  this.errorMessage=error.message;
      }
    )
  }
  increase(data:string)
  {
   this.httpClient.post("http://localhost:3000/increase",data,{responseType: 'text'})
   .subscribe(
      (res)=> {
        var json=JSON.parse(res);
        console.log(JSON.stringify(res));
     if(json.state==1)
     {
    
     }
    
      },
      (error)=>{

  console.log("erreur de suavegarde"+ error.message);
  this.errorMessage=error.message;
      }
    )
  }
  setSpeed(data:string)
  {
   this.httpClient.post("http://localhost:3000/setSpeed",data,{responseType: 'text'})
   .subscribe(
      (res)=> {
        var json=JSON.parse(res);
        console.log(JSON.stringify(res));
     if(json.state==1)
     {
    
     }
    
      },
      (error)=>{

  console.log("erreur de suavegarde"+ error.message);
  this.errorMessage=error.message;
      }
    )
  }
  decrease(data:string)
  {
   this.httpClient.post("http://localhost:3000/decrease",data,{responseType: 'text'})
   .subscribe(
      (res)=> {
        var json=JSON.parse(res);
        console.log(JSON.stringify(res));
     if(json.state==1)
     {
    
     }
    
      },
      (error)=>{

  console.log("erreur de suavegarde"+ error.message);
  this.errorMessage=error.message;
      }
    )
  }

  setOrder(data:string)
  {
   this.httpClient.post("http://localhost:3000/setOrder",data,{responseType: 'text'})
   .subscribe(
      (res)=> {
        var json=JSON.parse(res);
        console.log(JSON.stringify(res));
     if(json.state==1)
     {
    
     }
    
      },
      (error)=>{

  console.log("erreur de suavegarde"+ error.message);
  this.errorMessage=error.message;
      }
    )
  }

  }

