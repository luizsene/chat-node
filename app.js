'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
// const https = require('https').Server({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }, app);
const https = require('http').Server(app);
const io = require('socket.io').listen(https);
const stream = require('socket.io-stream');
const chat = require('./core/interface')(io, stream);
const timer = require('./core/interval');

timer();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

https.listen(1234, function(){
  console.log('listening on *:1234');
});
