'use strict';
const fs = require('fs');
const app = require('express')();
// const https = require('https').Server({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }, app);
const https = require('http').Server(app);
const io = require('socket.io').listen(https);
const chat = require('./core/interface')(io);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

https.listen(3000, function(){
  console.log('listening on *:3000');
});
