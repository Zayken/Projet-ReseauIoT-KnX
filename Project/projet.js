var knx = require('knx');
let i=4;
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
        },1000);
      },2000);

    },
    event: function (evt, src, dest, value) {
      //console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
      //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      //evt, src, dest, value);
      switch(dest){
        case '0/3/1':
          //console.log(dest);
          //setTimeout(function(){
          //  let x=chenillardOn(i);
          //},500);
        break;
        case '0/3/2':
          // console.log(dest);
          // setTimeout(function(){
          //   chenillardOff(x);
          // },500);
        break;
        case '0/3/3':

        break;
        case '0/3/4':

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



function chenillardOn(i){
    console.log('start');
    let chenillard=setInterval(function(){
      i=i%5;
      if(i==0){i++;}
      console.log(i);
      if(i==4){
        connection.write("0/1/4", 0);
        connection.write("0/1/1", 1);
      }else{
        connection.write("0/1/"+String(i), 0);
        connection.write("0/1/"+String(i+1), 1);
      }
      i++;      
    },1000);
    return chenillard;
}

function chenillardOff(chenillard){
  clearInterval(chenillard);
}
