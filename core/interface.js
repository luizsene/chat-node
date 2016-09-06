'use strict';

const User = require('./user');

/**
 * Represents a book.
 * @name interface
 * @constructor
 * @param {object} io - Instance of socket.io
 */
const interface_chat = (io) =>{

  /**
  * Connection a new user event
  *
  * @event Interface#connection
  * @type {object}
  * @property {object} socket - Single instance of connection.
  */
  io.on('connection', (socket) =>{

    let user;

    /**
    * @event Interface#connection#connection
    * @type {object}
    */
    socket.emit('connection', {status: true});

    /**
    * @event Interface#connection#connectio-accepted
    * @type {object}
    * @param {object} data
    */
    socket.on('connection-accepted', (data) => {
      user = new User(socket, data);
      socket.emit('connection-on', {status: true});
      // TODO: verificar se o novo usuário logado tem alguma coisa na fila
      //fnCheckQueue(socket, data);
    });


    socket.on('send-msg', (data) => {
      // TODO: disparar msg para a devida pessoa
      user.sendTo(data.id, data);

      // TODO: Enviar push notification para a pessoa
      //fnNotifyUser(data)
    });


    // TODO: collector garbage
    socket.on('disconnect', () => {
      // TODO: Remove usuario da lista de online
    //  fnOffline();
    });
  });
};

module.exports = interface_chat;
