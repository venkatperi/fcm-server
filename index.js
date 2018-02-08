var mqtt = require('mqtt')
var Sender = require('node-xcs').Sender;
var Result = require('node-xcs').Result;
var Message = require('node-xcs').Message;
var Notification = require('node-xcs').Notification;

var auth = require('./serverauth.json');
var mqttAuth = require('./mqttauth.json');
var xcs = new Sender(auth.senderId, auth.serverKey);

var mqttConnected = false;
var mqttClient  = mqtt.connect(mqttAuth)
.on('error', console.log)
.on('connect', function () {
  console.log('mqtt connected');
  mqttConnected = true;
})

xcs.on('message', function(messageId, from,  data, category){
  console.log('message: ' + messageId + ', from: ' + from );
  data.tst = Number(data.tst) / 1000
  data.lat = Number(data.lat)
  data.lon = Number(data.lon)
  data.acc = Number(data.acc)
  console.log(JSON.stringify(data));
  if (mqttConnected)
    mqttClient.publish('owntracks/venkat/phone', JSON.stringify(data));
}); 
xcs.on('receipt', function(messageId, from,  data, category){}); 

xcs.on('connected', function(){
  console.log('fcm connected');
});

xcs.on('disconnected', console.log);
xcs.on('online', console.log);
xcs.on('error', console.log);
xcs.on('message-error', console.log);


