import { Component } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor()
  {
    var config = {
      apiKey: "AIzaSyDntMPbZR07qH9DR5NdUsQY2d-189thy9M",
      authDomain: "knx-project.firebaseapp.com",
      databaseURL: "https://knx-project.firebaseio.com",
      projectId: "knx-project",
      storageBucket: "",
      messagingSenderId: "292861710786"
    };
    firebase.initializeApp(config);
  
  }
}
