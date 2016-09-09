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

    socket.emit('connection', {status: true});

    socket.on('connection-accepted', (data) => {
      user = new User(socket, data);
      socket.emit('connection-on', {status: true});
      // TODO: verificar se o novo usuário logado tem alguma coisa na fila
      //fnCheckQueue(socket, data);
    });

    socket.on('send-message', (data) => {
      user.sendTo(data.id, data);
    });

    socket.on('disconnect', (data) => {
      // TODO: Remove usuario da lista de online
      user.offline(data.user_id);
    });

  });
};

module.exports = interface_chat;
