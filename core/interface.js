'use strict';

const User = require('./user');

/**
* Represents a connection between users.
* @module core/interface
* @name Interface
* @param {object} io - Instance of socket.io
*/

const interface_chat = (io) =>{

  /**
  * Open server connection
  * @event connection
  * @param {object} socket - client socket
  */
  io.on('connection', (socket) =>{

    //instance of user
    let user;

    //send to client message connect open
    socket.emit('connection', {status: true});

    /**
    * Client send to server message saying your credentials
    * @event connection-accepted
    * @param {object} data - data of user
    */
    socket.on('connection-accepted', (data) => {
      user = new User(socket, data);
      socket.emit('connection-on', {status: true});
      // TODO: verificar se o novo usuário logado tem alguma coisa na fila
      //fnCheckQueue(socket, data);
    });

    /**
    * Send message
    * @event send-message
    * @param {object} data - data of message
    */
    socket.on('send-message', (data) => {
      // TODO: disparar msg para a devida pessoa
      user.sendTo(data.id, data);

      // TODO: Enviar push notification para a pessoa
      //fnNotifyUser(data)
    });


    /**
    * Remove user connected
    * @event desconnect
    * @param {object} data - data of user
    */
    socket.on('disconnect', (data) => {
      // TODO: Remove usuario da lista de online
      user.offline(data.user_id);
    });
  });
};

module.exports = interface_chat;
