'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const chat = require('./core/interface')(io);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
