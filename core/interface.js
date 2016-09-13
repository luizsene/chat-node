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
const interface_chat = (io, stream) =>{

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

      //verify if user has any message
      user.checkQueue(data.id);
    });

    // send message
    socket.on('send-message', (data) => {
      user.isOnline(data.receiver).online
          ? user.sendTo(data.receiver, data)
          : user.saveQueue(data.receiver, data);
    });

    // send message
    stream(socket).on('send-file', (socketStream, data) => {
      //TODO: implamentação
      // user.isOnline(data.receiver).online
      //     ? user.sendFileTo(data.receiver, socketStream, data)
      //     : user.saveQueue(data.receiver, data);
    });

    // disconnect
    socket.on('disconnect', (data) => {
      user ? user.offline(data.user_id || 0) : null;
    });

  });
};

module.exports = interface_chat;
