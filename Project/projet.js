var knx = require('knx');

class Chenillard {

  constructor(arrayOrder,ms){
    this.arrayOrder=arrayOrder;
    this.ms=ms;
  }

  start(){
    console.log('Start');
    this.chenillard=chenillardOn(this.arrayOrder,this.ms);
  }
  stop(){
    console.log('Stop');
    chenillardOff(this.chenillard);
  }

  getMs(){return this.ms}

  loadMs(ms){
    this.ms=checkMs(ms);
    chenillardOff(this.chenillard);
    this.chenillard=chenillardOn(this.arrayOrder,this.ms);
  }

  increaseMs(ms){
    this.ms=checkMs(this.ms+ms);
    chenillardOff(this.chenillard);
    this.chenillard=chenillardOn(this.arrayOrder,this.ms);
  }

  decreaseMs(ms){
    this.ms=checkMs(this.ms-ms);
    chenillardOff(this.chenillard);
    this.chenillard=chenillardOn(this.arrayOrder,this.ms);
  }

  loadOrder(arrayOrder){
    this.arrayOrder=arrayOrder;
    chenillardOff(this.chenillard);
    this.chenillard=chenillardOn(this.arrayOrder,this.ms);
  }

  loadBoth(arrayOrder,ms){
    this.ms=checkMs(ms);
    this.arrayOrder=arrayOrder;
    chenillardOff(this.chenillard);
    this.chenillard=chenillardOn(this.arrayOrder,this.ms);
  }
}

function chenillardOn(arrayOrder,ms){
  if(arrayOrder=='random'){
    return randomChenillardOn(ms);
  }
  else{
    let i=arrayOrder.indexOf(currentLight);
    let chenillard=setInterval(function(){
      if (i==4){i=0;}
      connection.write("0/1/"+arrayOrder[i], 0);
      connection.write("0/1/"+arrayOrder[(i+1)%4], 1);
      currentLight=String(arrayOrder[(i+1)%4]);
      i++;  
    },ms);
    return chenillard;
  }
}

function randomChenillardOn(ms){
  let arrayOrder=['1','2','3','4'];
  let i;
    let chenillard=setInterval(function(){
      i=arrayOrder.indexOf(currentLight);
      connection.write("0/1/"+arrayOrder[i], 0);
      arrayOrder.splice(i,1);
      next=getRandomInt(3);
      connection.write("0/1/"+arrayOrder[next], 1);
      arrayOrder.push(currentLight);
      currentLight=arrayOrder[next];
    },ms);
    return chenillard;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function checkMs(ms){
  if(ms>2500){
    return 2500;
  }
  else if(ms<500){
    return 500;
  }
  else{
    return ms;
  }
}

function chenillardOff(chenillard){
  clearInterval(chenillard);
}

let button1State=0;
let button2State=1;

let array1=['1','2','3','4'];
let array2=['4','3','2','1'];
let array3=['1','3','2','4'];
let array4='random';

let currentLight='4';

var connection = knx.Connection({
  ipAddr: '192.168.0.6',
  ipPort: 3671,
  //interface: 'eth0',
  //physAddr: '1.1',
  // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
  //loglevel: 'info',
  // print lots of debug output to the console
  //debug: true,
  // do not automatically connect, but use connection.Connect() to establish connection
  //manualConnect: true,  
  // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
  //forceTunneling: true,
  // wait at least 10 millisec between each datagram
  //minimumDelay: 10,
  // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
  //suppress_ack_ldatareq: false,
  // define your event handlers here:
  handlers: {
    connected: function() {
      console.log('Connected!');
      setTimeout(function(){
        connection.write("0/1/1", 1);
        connection.write("0/1/2", 1);
        connection.write("0/1/3", 1);
        connection.write("0/1/4", 1);
        setTimeout(function(){
          connection.write("0/1/1", 0);
          connection.write("0/1/2", 0);
          connection.write("0/1/3", 0);
          connection.write("0/1/4", 0);
          setTimeout(function(){
            chenillard=new Chenillard(array1,1500);
          },500);
        },1000);
      },1500);

    },
    event: function (evt, src, dest, value) {
      //console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
      //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      //evt, src, dest, value);
      switch(dest){
        case '0/3/1': //start/stop chenillard
          switch(button1State){
            case 0:
              chenillard.start();
              button1State=1;
            break;
            case 1:
              chenillard.stop();
              button1State=0;
            break;
          }
        break;

        case '0/3/2':   //change chennilard order
          switch(button2State){
            case 0:
              chenillard.loadOrder(array2);
              button1State=1;
            break;
            case 1:
              chenillard.loadOrder(array3);
              button1State=2;
            break;
            case 2:
              chenillard.loadOrder(array1);
              button1State=0;
            break;
          }
        break;
        case '0/3/3':     //increase speed
          chenillard.increaseMs(250);
        break;
        case '0/3/4':     //decrease speed
          chenillard.decreaseMs(250);
        break;
      }
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});

// Handling Ctrl-C cleanly in Node.js
/**process.on('SIGINT', function() {
  connection.Disconnect();
  console.log('Disconnected');
  process.exit();
});**/

/*let chenillard=new Chenillard(array1,1000);
chenillard.start();
  setTimeout(function(){
    console.log('speedDecreased');
    chenillard.decreaseMs(500);
    setTimeout(function(){
      console.log('speedIncreased');
      chenillard.increaseMs(1000);
      console.log(chenillard.getMs())
      setTimeout(function(){
      },3000);
    },3000);
},3000);*/