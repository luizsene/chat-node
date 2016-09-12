'use strict';

/**
* User class import
* @member {Object}
* @memberof Interface
*/
const User = require('./user');

/**
* Represents a connection between users.
* @namespace
* @module Interface
* @param {Object} io - Socket.io instance
* @author Fábio Pereira <fabio.pereira.gti@gmail.com>
*/
const interface_chat = (io) =>{

  io.on('connection', (socket) =>{

    let user;

    // Open de connection
    socket.emit('connection', {status: true});

    // handshack
    socket.on('connection-accepted', (data) => {

      // instance of new user
      user = new User(socket, data);

      // confirm connection with client
      socket.emit('connection-on', {status: true});

      //verify if destination user is online
      if(user.isOnline(data.id))
        user.checkQueue(data.id);
      else
        user.saveQueue(data.destination, data);
    });

    // send message
    socket.on('send-message', (data) => {
      user.sendTo(data.id, data);
    });

    // disconnect
    socket.on('disconnect', (data) => {
      user.offline(data.user_id || 0);
    });

  });
};

module.exports = interface_chat;
