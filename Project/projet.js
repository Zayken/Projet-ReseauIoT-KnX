var knx = require('knx');

const app = require('express')();

var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function (req, res) {
  res.end();
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

let socketTab = [];
let connectionArray = [];
let connectionSockets = [];
let connectionJson = [];

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
  console.log('Un client est connecté !');
  socketTab.push(socket);
});

server.listen(8080);
class Chenillard {

  constructor(arrayOrder, ms) {
    this.arrayOrder = arrayOrder;
    this.ms = ms;
    this.state = false;
  }

  start() {
    console.log('Start');
    this.chenillard = chenillardOn(this.arrayOrder, this.ms);
    this.state = true;
  }

  stop() {
    console.log('Stop');
    chenillardOff(this.chenillard);
    this.state = false;
  }

  loadMs(ms) {
    chenillardOff(this.chenillard);
    this.ms = checkMs(ms);
    if (this.state) {
      this.chenillard = chenillardOn(this.arrayOrder, this.ms);
    }
  }

  increaseMs(ms) {
    chenillardOff(this.chenillard);
    this.ms = checkMs(this.ms + ms);
    if (this.state) {
      this.chenillard = chenillardOn(this.arrayOrder, this.ms);
    }

  }

  decreaseMs(ms) {
    chenillardOff(this.chenillard);
    this.ms = checkMs(this.ms - ms);
    if (this.state) {
      this.chenillard = chenillardOn(this.arrayOrder, this.ms);
    }
  }

  loadOrder(arrayOrder) {
    chenillardOff(this.chenillard);
    this.arrayOrder = arrayOrder;
    if (this.state) {
      this.chenillard = chenillardOn(this.arrayOrder, this.ms);
    }
  }

  loadBoth(arrayOrder, ms) {
    chenillardOff(this.chenillard);
    this.ms = checkMs(ms);
    this.arrayOrder = arrayOrder;
    if (this.state) {
      this.chenillard = chenillardOn(this.arrayOrder, this.ms);
    }
  }
}

function chenillardOn(arrayOrder, ms) {
  if (arrayOrder.includes('random')) {
    return randomChenillardOn(arrayOrder.replace(/^\D+/g, ''), ms);
  }
  else {
    if (currentLight == undefined) { currentLight = arrayOrder[arrayOrder.length - 1]; }
    let i = arrayOrder.indexOf(currentLight);
    if (i == -1) {
      currentLight = arrayOrder[0];
      i = arrayOrder.indexOf(currentLight);
    }
    let chenillard = setInterval(function () {
      if (i == arrayOrder.length) { i = 0; }
      console.log('connection' + Math.trunc((Number(arrayOrder[i]) - 1) / 4), convert(arrayOrder, i), arrayOrder[i]);
      console.log('connection' + Math.trunc((Number(arrayOrder[(i + 1) % arrayOrder.length]) - 1) / 4), convert(arrayOrder, (i + 1) % arrayOrder.length), arrayOrder[(i + 1) % arrayOrder.length]);
      eval('connection' + Math.trunc((Number(arrayOrder[i]) - 1) / 4)).write("0/1/" + convert(arrayOrder, i), 0);
      eval('connection' + Math.trunc((Number(arrayOrder[(i + 1) % arrayOrder.length]) - 1) / 4)).write("0/1/" + convert(arrayOrder, (i + 1) % arrayOrder.length), 1);
      currentLight = String(convert(arrayOrder, (i + 1) % arrayOrder.length));
      i++;
    }, ms);
    return chenillard;
  }
}

function convert(array, index) {
  if (Number(array[index]) % 4 == 0) {
    return String(4);
  }
  else {
    return String(Number(array[index]) % 4);
  }
}

function randomChenillardOn(size, ms) {
  let arrayOrder = [];
  let i = 0;
  while (i < size) {
    arrayOrder.push(String(i + 1));
    i++;
  }
  let chenillard = setInterval(function () {
    i = arrayOrder.indexOf(currentLight);
    console.log('connection' + Math.trunc((Number(arrayOrder[i]) - 1) / 4), convert(arrayOrder, i), arrayOrder[i]);
    eval('connection' + Math.trunc((Number(arrayOrder[i]) - 1) / 4)).write("0/1/" + convert(arrayOrder, i), 0);
    arrayOrder.splice(i, 1);
    next = getRandomInt(arrayOrder.length - 1);
    console.log('connection' + Math.trunc((Number(arrayOrder[next]) - 1) / 4), convert(arrayOrder, next), arrayOrder[next]);
    eval('connection' + Math.trunc((Number(arrayOrder[next]) - 1) / 4)).write("0/1/" + convert(arrayOrder, next), 1);
    arrayOrder.push(currentLight);
    currentLight = arrayOrder[next];
  }, ms);
  return chenillard;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function checkMs(ms) {
  if (ms > 2500) {
    return 2500;
  }
  else if (ms < 500) {
    return 500;
  }
  else {
    return ms;
  }
}

function chenillardOff(chenillard) {
  clearInterval(chenillard);
}

class Motif {

  //ArrayMotif like [0,0,1,1]

  constructor(arrayMotif) {
    this.arrayMotif = arrayMotif;
  }

  activeMotif() {
    let i = 0;
    this.arrayMotif.forEach(function (e) {
      i++;
      connection.write("0/1/" + i, e);
    })
  }

  setMotif(arrayMotif) {
    this.arrayMotif = arrayMotif;
    this.activeMotif();
  }
}

class MotifChenillard {

  constructor(arrayOrder, ms) {
    this.arrayOrder = arrayOrder;
    this.ms = ms;
  }

  start() {
    console.log('Start');
    this.chenillard = chenillardMotifOn(this.arrayOrder, this.ms);
  }

  stop() {
    console.log('Stop');
    chenillardMotifOff(this.chenillard);
  }

  loadMs(ms) {
    chenillardMotifOff(this.chenillard);
    this.ms = checkMs(ms);
    this.chenillard = chenillardMotifOn(this.arrayOrder, this.ms);
  }

  increaseMs(ms) {
    chenillardMotifOff(this.chenillard);
    this.ms = checkMs(this.ms + ms);
    this.chenillard = chenillardMotifOn(this.arrayOrder, this.ms);
  }

  decreaseMs(ms) {
    chenillardMotifOff(this.chenillard);
    this.ms = checkMs(this.ms - ms);
    this.chenillard = chenillardMotifOn(this.arrayOrder, this.ms);
  }

  loadOrder(arrayOrder) {
    chenillardMotifOff(this.chenillard);
    this.arrayOrder = arrayOrder;
    this.chenillard = chenillardMotifOn(this.arrayOrder, this.ms);
  }

  loadBoth(arrayOrder, ms) {
    chenillardMotifOff(this.chenillard);
    this.ms = checkMs(ms);
    this.arrayOrder = arrayOrder;
    this.chenillard = chenillardMotifOn(this.arrayOrder, this.ms);
  }

}

function chenillardMotifOn(arrayOrder, ms) {
  let i = arrayOrder.indexOf(currentMotif);
  let chenillard = setInterval(function () {
    if (i == arrayOrder.length) { i = 0; }
    arrayOrder[i].activeMotif();
    currentMotif = arrayOrder[i];
    i++;
  }, ms);
  return chenillard;
}

function chenillardMotifOff(chenillard) {
  clearInterval(chenillard);
}

let button1State = 0;
let button2State = 0;
let button1StateMotif = 0;

let array1 = ['1', '2', '3', '4'];
let array2 = ['4', '3', '2', '1'];
let array3 = ['1', '3', '2', '4'];

let currentLight;
let activeChenillard = 'normal';

let m1 = new Motif([1, 1, 0, 0]);
let m2 = new Motif([0, 1, 1, 0]);
let m3 = new Motif([0, 0, 1, 1]);
let m4 = new Motif([1, 0, 0, 1]);
let m5 = new Motif([0, 0, 0, 0]);
let m6 = new Motif([0, 0, 0, 0]);
let m7 = new Motif([0, 0, 0, 0]);
let m8 = new Motif([0, 0, 0, 0]);


let currentMotif = m5;


var url = require("url");
var querystring = require('querystring');

//let ipConnect='192.168.0.5';
//let connectionArray=[];   //[[connection0,socket1,socket2],[connection1,socket1],[connection2,socket3]]

//let connectionJson=[];   //[jsonCon0,jsonCon1,jsonCon2]

let jsonConnection;

let lampes = [
  {
    "status": 0,
    "lampeId": 1
  },
  {
    "status": 0,
    "lampeId": 2
  },
  {
    "status": 0,
    "lampeId": 3
  },
  {
    "status": 0,
    "lampeId": 4
  }
];

let chenillard;
let motifChenillard;
let connection0;
let connection1;

var cors = require('cors')


app.use(cors());
app.post('/connect', function (req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    let json = JSON.parse(body);
    console.log('Trying to connect');

    /**let jsonConnection;
    index=connectionJson.findIndex(function (obj){ return obj.ip==json.data.ip});
    if(index==-1){//Connection existe pas
        index=connectionJson.findIndex(function (obj){ return obj.ip==null});
        if(index==-1){
            jsonConnection=JSON.parse("{ \"id\":"+connectionJson.length+",\"ip\":\""+json.data.ip+"\",\"light\": [\"1\",\"2\",\"3\",\"4\"],\"state\": [0,0,0,0]}");
            connectionJson.push(jsonConnection);
            connectionArray.push("connection"+connectionArray.length);
            connectionSockets.push([s])
        }
        else{
            jsonConnection=JSON.parse("{ \"id\":"+index+",\"ip\":\""+json.data.ip+"\",\"light\": [\"1\",\"2\",\"3\",\"4\"],\"state\": [0,0,0,0]}");
            connectionJson[index]=jsonConnection;
            connectionArray[index]=("connection"+index);
            connectionSockets[index].push(s);
        }
    }
    else{//Connection existe
        let index1=connectionSockets[index].findIndex(function (obj){ return obj==s});
        if(index1!=-1){
            //already connected 
        }
        else{
            //not already connected
            connectionSockets[index].push(s);
        }
        
    }
    console.log(connectionArray);
    console.log(connectionJson);
    console.log(connectionSockets);**/



    connection0 = knx.Connection({
      ipAddr: json.data.ip,
      ipPort: 3671,
      // define your event handlers here:
      handlers: {
        connected: function () {
          console.log('Connected!');
          setTimeout(function () {
            connection0.write("0/1/1", 1);
            connection0.write("0/1/2", 1);
            connection0.write("0/1/3", 1);
            connection0.write("0/1/4", 1);
            setTimeout(function () {
              connection0.write("0/1/1", 0);
              connection0.write("0/1/2", 0);
              connection0.write("0/1/3", 0);
              connection0.write("0/1/4", 0);
              setTimeout(function () {
                let msg = { ip: json.data.ip, lampes: lampes, check: 1 };
                res.send(JSON.stringify(msg));
                chenillard = new Chenillard(['1', '2', '3', '4'], 1500);
                motifChenillard = new MotifChenillard([m5, m1, m6, m2, m7, m3, m8, m4], 1500);
              }, 500);
            }, 1000);
          }, 1500);

        },
        event: function (evt, src, dest, value) {
          if (dest.substring(2, 3) == '2') {
            console.log('light' + dest.substring(4, 5));
            console.log('state' + JSON.parse(JSON.stringify(value)).data[0]);
            console.log(json.data.ip);
            //let tab={lampeId:parseInt(dest.substring(4,5)),status:JSON.parse(JSON.stringify(value)).data[0]};
            let msg = { ip: json.data.ip, lampeId: parseInt(dest.substring(4, 5)), status: JSON.parse(JSON.stringify(value)).data[0] };
            let msg2 = { ip: json.data.ip, started: button1State };
            socketTab.forEach(function (socket) {
              console.log('emit');
              socket.emit('event', JSON.stringify(msg));

              socket.emit('button', JSON.stringify(msg2));
            })
          }
          switch (dest) {
            case '0/3/1': //start/stop chenillard
              console.log('b1');
              switch (activeChenillard) {
                case 'normal':
                  switch (button1State) {
                    case 0:
                      chenillard.start();
                      button1State = 1;
                      break;
                    case 1:
                      chenillard.stop();
                      button1State = 0;
                      break;
                  }
                  break;
                case 'motif':
                  switch (button1StateMotif) {
                    case 0:
                      motifChenillard.start();
                      button1StateMotif = 1;
                      break;
                    case 1:
                      motifChenillard.stop();
                      button1StateMotif = 0;
                      break;
                  }
                  break;
              }
              break;
            case '0/3/2':   //change chennilard order
              console.log('b2');
              switch (activeChenillard) {
                case 'normal':
                  switch (button2State) {
                    case 0:
                      console.log('test');
                      chenillard.loadOrder(array2);
                      button2State = 1;
                      break;
                    case 1:
                      console.log('test');
                      chenillard.loadOrder(array3);
                      button2State = 2;
                      break;
                    case 2:
                      console.log('test');
                      chenillard.loadOrder(array1);
                      button2State = 0;
                      break;
                  }
                  break;
                case 'motif':
                  break;
              }
              break;

            case '0/3/3':     //decrease speed
              console.log('b3');
              switch (activeChenillard) {
                case 'normal':
                  chenillard.increaseMs(250);
                  break;
                case 'motif':
                  motifChenillard.increaseMs(250);
                  break;
              }
              break;

            case '0/3/4':     //increase speed
              console.log('b4');
              switch (activeChenillard) {
                case 'normal':
                  chenillard.decreaseMs(250);
                  break;
                case 'motif':
                  motifChenillard.decreaseMs(250);
                  break;
              }
              break;
          }
        },
        // get notified on connection errors
        error: function (connstatus) {
          console.log("**** ERROR: %j", connstatus);
        }
      }
    });

  });
  /*index=connectionJson.findIndex(function (obj) {return  obj.ip==ipConnect;})
  if(index==-1){
    //La connection entre le serveur et le systeme n'est pas établie
    index=connectionJson.findIndex(function (obj) {return  obj==null})
    if(index==-1){
      jsonConnection=JSON.parse("{ \"id\""=+connectionJson.length+",\"ip\"=\""+ipConnect+"\",\"light\": [\"1\",\"2\",\"3\",\"4\"],\"state\": [0,0,0,0]}");
      connectionJson.push(jsonConnection);
    }
    else{
      jsonConnection=JSON.parse("{ \"id\""=+index+",\"ip\"=\""+ipConnect+"\",\"light\": [\"1\",\"2\",\"3\",\"4\"],\"state\": [0,0,0,0]}");
      connectionJson[index](jsonConnection);
    }
  }
  else{
  //La connection entre le serveur et le systeme est établie

  }*/


});

app.post('/disconnect', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
    console.log(body);
  });

  req.on('end', () => {
    let json = JSON.parse(body);
    connection0.Disconnect();
    console.log('Disconnected');
    let msg = { cmd: "disconnect", ip: json.data.ip, state: 1 };
    res.send(JSON.stringify(msg));
  });

});

app.get('/reset', (req, res) => {
  connection0.write("0/1/1", 0);
  connection0.write("0/1/2", 0);
  connection0.write("0/1/3", 0);
  connection0.write("0/1/4", 0);
  res.end();
});

/////////////////////////
//  Simple chenillard //
////////////////////////

app.post('/chenillard', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
    console.log(body);
  });

  req.on('end', () => {
    let json = JSON.parse(body);


    if (json.cmd == "start") {
      activeChenillard = 'normal';
      chenillard.start();
      button1State = 1;
      let msg = { cmd: "start", ip: json.data.ip, check: 1 };
      res.send(JSON.stringify(msg));
    }
    else if (json.cmd == "stop") {
      chenillard.stop();
      button1State = 0;
      let msg = { cmd: "stop", ip: json.data.ip, check: 1 };
      res.send(JSON.stringify(msg));
    }
  });
});


app.post('/lightState', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let json = JSON.parse(body);
    console.log("Light: " + json.data.lampId + " changed to " + json.data.state);
    connection0.write("0/1/" + json.data.lampId, json.data.state);
    let msg = { ip: json.data.ip, check: 1 };
    res.send(JSON.stringify(msg));
  });
});

app.get('/change', (req, res) => {
  switch (button2State) {
    case 0:
      chenillard.loadOrder(array2);
      button2State = 1;
      break;
    case 1:
      chenillard.loadOrder(array3);
      button2State = 2;
      break;
    case 2:
      chenillard.loadOrder(array1);
      button2State = 0;
      break;
  }
  res.end();
});

app.post('/decrease', (req, res) => {

  //  /decrease ==> default value =250 ms
  //  /decrease?speed=X ==> value =X ms

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let json = JSON.parse(body);
    console.log(" Speed decreseaded by" + json.data.speed);
    chenillard.increaseMs(json.data.speed);
    let msg = { ip: json.data.ip, check: 1 };
    res.send(JSON.stringify(msg));
  });

  /**var params = querystring.parse(url.parse(req.url).query);
  if ('speed' in params){
    chenillard.increaseMs(params['speed']);
    console.log('decreased by '+params['speed']);
  }
  else{
    chenillard.increaseMs(250);
    console.log('decreased by 250');
  }
  res.end();*/
});

app.post('/increase', (req, res) => {

  //  /increase ==> default value =250 ms
  //  /increase?speed=X ==> value =X ms

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let json = JSON.parse(body);
    console.log(" Speed increseaded by" + json.data.speed);
    chenillard.decreaseMs(json.data.speed);
    let msg = { ip: json.data.ip, check: 1 };
    res.send(JSON.stringify(msg));
  });

  /**var params = querystring.parse(url.parse(req.url).query);
  if ('speed' in params){
    chenillard.decreaseMs(params['speed']);
    console.log('increased by '+params['speed']);
  }
  else{
    chenillard.decreaseMs(250);
    console.log('increased by 250');
  }
  res.end();*/
});

app.post('/setSpeed', (req, res) => {

  //  /setSpeed ==> default value =250 ms
  //  /setSpeed?speed=X ==> value =X ms

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let json = JSON.parse(body);
    console.log(" Speed increseaded by" + json.data.speed);
    chenillard.loadMs(json.data.speed);
    let msg = { ip: json.data.ip, check: 1 };
    res.send(JSON.stringify(msg));
  });

  /*var params = querystring.parse(url.parse(req.url).query);
  if ('speed' in params){
    chenillard.loadMs(params['speed']);
    console.log('set to '+params['speed']);
  }
  else{
    chenillard.loadMs(1000);
    console.log('set to 1000');
  }
  res.end();*/
});

app.post('/setOrder', (req, res) => {

  //  /setOrder?order=['4','1','3','2']

  //  /setOrder?order=array1
  //  array1=['1','2','3','4'];
  //  array2=['4','3','2','1'];
  //  array3=['1','3','2','4'];
  //  array4='random';
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let json = JSON.parse(body);
    console.log(" Order changed to " + json.data.order);
    chenillard.loadOrder(json.data.order);
    let msg = { ip: json.data.ip, check: 1 };
    res.send(JSON.stringify(msg));
  });

  /*try{
    var params = querystring.parse(url.parse(req.url).query);
    if ('order' in params){
      chenillard.loadOrder(eval(params['order']));
      console.log('order set to ['+eval(params['order'])+']');
    }
    res.end();
  }
  catch{
    var params = querystring.parse(url.parse(req.url).query);
    if ('order' in params){
      chenillard.loadOrder(params['order'].replace("[","").replace("]","").split(","));
      console.log('order set to '+params['order']);
    }
    res.end();
  }*/
});

/////////////////////////
//  Motif chenillard //
////////////////////////

app.get('/startMotif', (req, res) => {
  activeChenillard = 'motif';
  motifChenillard.start();
  button1StateMotif = 1;
  res.end();
});

app.get('/stopMotif', (req, res) => {
  motifChenillard.stop();
  button1StateMotif = 0;
  res.end();
});

app.get('/decreaseMotif', (req, res) => {

  //  /decreaseMotif ==> default value =250 ms
  //  /decreaseMotif?speed=X ==> value =X ms

  var params = querystring.parse(url.parse(req.url).query);
  if ('speed' in params) {
    motifChenillard.increaseMs(params['speed']);
    console.log('decreased by ' + params['speed']);
  }
  else {
    motifChenillard.increaseMs(250);
    console.log('decreased by 250');
  }
  res.end();
});

app.get('/increaseMotif', (req, res) => {

  //  /increaseMotif ==> default value =250 ms
  //  /increaseMotif?speed=X ==> value =X ms

  var params = querystring.parse(url.parse(req.url).query);
  if ('speed' in params) {
    motifChenillard.decreaseMs(params['speed']);
    console.log('increased by ' + params['speed']);
  }
  else {
    motifChenillard.decreaseMs(250);
    console.log('increased by 250');
  }
  res.end();
});

app.get('/setSpeedMotif', (req, res) => {

  //  /setSpeedMotif ==> default value =250 ms
  //  /setSpeedMotif?speed=X ==> value =X ms

  var params = querystring.parse(url.parse(req.url).query);
  if ('speed' in params) {
    motifChenillard.loadMs(params['speed']);
    console.log('set to ' + params['speed']);
  }
  else {
    motifChenillard.loadMs(1000);
    console.log('set to 1000');
  }
  res.end();
});

let bothChenillard= new Chenillard(['1', '2', '3', '4', '5', '6', '7', '8'], 500);
let arrayBoth1 = ['1', '2', '3', '4', '5', '6', '7', '8'];
let arrayBoth2 = ['8', '7', '6', '5', '4', '3', '2', '1'];
let arrayBoth3 = ['2', '3', '5', '8', '1', '4', '6', '7'];

let ready1 = false;
let ready2 = false;

let button1StateBoth = 0;
let button2StateBoth = 0;

app.get('/connectBoth', (req, res) => {


  let ip1 = '192.168.1.5';
  let ip2 = '192.168.1.10';


  connection0 = knx.Connection({
    ipAddr: ip1,
    ipPort: 3671,
    // define your event handlers here:
    handlers: {
      connected: function () {
        console.log('Connected to 1 !');
        setTimeout(function () {
          connection0.write("0/1/1", 1);
          connection0.write("0/1/2", 1);
          connection0.write("0/1/3", 1);
          connection0.write("0/1/4", 1);
          setTimeout(function () {
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            setTimeout(function () {
              ready1 = true;
              if (ready1 & ready2) {
                bothChenillard.start();
                button1StateBoth = 1;
                console.log('in');
                
              }
            }, 500);
          }, 1000);
        }, 1500);
      },
      event: function (evt, src, dest, value) {
        //console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
        //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        //evt, src, dest, value);
        switch (dest) {
          case '0/3/1': //start/stop chenillard
            console.log('b1');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            switch (button1StateBoth) {
              case 0:
                bothChenillard.start();
                button1StateBoth = 1;
                break;
              case 1:
                bothChenillard.stop();
                button1StateBoth = 0;
                break;
            }

            break;
          case '0/3/2':   //change chennilard order
            console.log('b2');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            switch (button2StateBoth) {
              case 0:
                console.log('test');
                bothChenillard.loadOrder(arrayBoth2);
                button2StateBoth = 1;
                break;
              case 1:
                console.log('test');
                bothChenillard.loadOrder(arrayBoth3);
                button2StateBoth = 2;
                break;
              case 2:
                console.log('test');
                bothChenillard.loadOrder(arrayBoth1);
                button2StateBoth = 0;
                break;
            }

            break;

          case '0/3/3':     //decrease speed
            console.log('b3');

            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            bothChenillard.increaseMs(250);



            break;

          case '0/3/4':     //increase speed
            console.log('b4');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            bothChenillard.decreaseMs(250);

            break;

        }
      },
      // get notified on connection errors
      error: function (connstatus) {
        console.log("**** ERROR: %j", connstatus);
      }
    }
  });

  connection1 = knx.Connection({
    ipAddr: ip2,
    ipPort: 3671,
    // define your event handlers here:
    handlers: {
      connected: function () {
        console.log('Connected to 2 !');
        setTimeout(function () {
          connection1.write("0/1/1", 1);
          connection1.write("0/1/2", 1);
          connection1.write("0/1/3", 1);
          connection1.write("0/1/4", 1);
          setTimeout(function () {
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            setTimeout(function () {
              ready2 = true;
              if (ready1 & ready2) {
                bothChenillard.start();
                button1StateBoth = 1;
                console.log('in');
          
              }
            }, 500);
          }, 1000);
        }, 1500);
      },
      event: function (evt, src, dest, value) {
        //console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
        //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        //evt, src, dest, value);
        switch (dest) {
          case '0/3/1': //start/stop chenillard
            console.log('b1');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            switch (button1StateBoth) {
              case 0:
                bothChenillard.start();
                button1StateBoth = 1;
                break;
              case 1:
                bothChenillard.stop();
                button1StateBoth = 0;
                break;
            }

            break;
          case '0/3/2':   //change chennilard order
            console.log('b2');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            switch (button2StateBoth) {
              case 0:
                console.log('test');
                bothChenillard.loadOrder(arrayBoth2);
                button2StateBoth = 1;
                break;
              case 1:
                console.log('test');
                bothChenillard.loadOrder(arrayBoth3);
                button2StateBoth = 2;
                break;
              case 2:
                console.log('test');
                bothChenillard.loadOrder(arrayBoth1);
                button2StateBoth = 0;
                break;
            }

            break;

          case '0/3/3':     //decrease speed
            console.log('b3');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);

            bothChenillard.increaseMs(250);



            break;

          case '0/3/4':     //increase speed
            console.log('b4');
            connection0.write("0/1/1", 0);
            connection0.write("0/1/2", 0);
            connection0.write("0/1/3", 0);
            connection0.write("0/1/4", 0);
            connection1.write("0/1/1", 0);
            connection1.write("0/1/2", 0);
            connection1.write("0/1/3", 0);
            connection1.write("0/1/4", 0);
            bothChenillard.decreaseMs(250);

            break;

        }
      },
      // get notified on connection errors
      error: function (connstatus) {
        console.log("**** ERROR: %j", connstatus);
      }
    }
  });

  /*function startBothChenillard(arrayOrder,ms){
    if(ready1&ready2){
      let i=arrayOrder.indexOf(currentBothLight);
      let chenillard=setInterval(function(){
        if (i==arrayOrder.length){i=0;}
        console.log(((i+1)%8)+1);
        console.log('connection'+Math.trunc((Number(arrayOrder[i])-1)/4),convert(arrayOrder,i));
        console.log('connection'+Math.trunc((Number(arrayOrder[(i+1)%arrayOrder.length])-1)/4),convert(arrayOrder,(i+1)%arrayOrder.length));
        //eval('connection'+Math.trunc((Number(arrayOrder[i])-1)/4)).write("0/1/"+convert(arrayOrder,i),0)
        //eval('connection'+Math.trunc((Number(arrayOrder[(i+1)%arrayOrder.length])-1)/4)).write("0/1/"+convert(arrayOrder,(i+1)%arrayOrder.length),1)
        i++;  
      },ms);
      return chenillard;
    }
  }
  
  function convert(array,index){
    if(Number(array[index])%4==0){
      return String(4);
    }
    else{ 
      return String(Number(array[index])%4);
    }
  }*/

  /*function startBothChenillard(arrayOrder,ms){
    if(ready1&ready2){
      let i=arrayOrder.indexOf(currentBothLight);
      let chenillard=setInterval(function(){
        if (i==8){i=0;}
        connection1.write("0/1/1", 0);
        connection1.write("0/1/2", 0);
        connection1.write("0/1/3", 0);
        connection1.write("0/1/4", 0);
        connection2.write("0/1/1", 0);
        connection2.write("0/1/2", 0);
        connection2.write("0/1/3", 0);
        connection2.write("0/1/4", 0);

        if(Math.trunc(i/4)==0){
          console.log(arrayOrder[i%4]);
          connection1.write("0/1/"+arrayOrder[i%4], 1);
          currentLight=String(arrayOrder[i]);
          i++;  
        }
        else if(Math.trunc(i/4)==1){
          console.log(arrayOrder[i%4]);
          connection2.write("0/1/"+arrayOrder[i%4], 1);
          currentLight=String(arrayOrder[i]);
          i++;  
        } 
      },ms);
      return chenillard;
    }
    else{
      return null;
    }
  }*/

});

/*let currentBothLight='9';
let bothChenillard=startBothChenillard(['1','2','3','4'],500);
function startBothChenillard(arrayOrder,ms){
  //if(ready1&ready2){
    let i=arrayOrder.indexOf(currentBothLight);
    let chenillard=setInterval(function(){
      if (i==arrayOrder.length){i=0;}
      console.log('connection'+Math.trunc((Number(arrayOrder[i])-1)/4),convert(arrayOrder,i));
      console.log('connection'+Math.trunc((Number(arrayOrder[(i+1)%arrayOrder.length])-1)/4),convert(arrayOrder,(i+1)%arrayOrder.length));
      //eval('connection'+Math.trunc((Number(arrayOrder[i])-1)/4)).write("0/1/"+convert(arrayOrder,i),0)
      //eval('connection'+Math.trunc((Number(arrayOrder[(i+1)%arrayOrder.length])-1)/4)).write("0/1/"+convert(arrayOrder,(i+1)%arrayOrder.length),1)
      i++;  
    },ms);
    return chenillard;
 // }
}

function convert(array,index){
  if(Number(array[index])%4==0){
    return String(4);
  }
  else{ 
    return String(Number(array[index])%4);
  }
}*/

app.get('/', (req, res) => {
  console.log('test');
  res.end();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});