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

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/files', express.static('files'));

https.listen(3000, function(){
  console.log('listening on *:3000');
});
