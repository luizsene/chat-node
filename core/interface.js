'use strict';

/**
* User class import
* @member {Object}
* @memberof Interface
*/
const User = require('./user');
const saveSQL = require('./sql');

/**
* Represents a connection between users.
* @namespace
* @module Interface
* @param {Object} io - Socket.io instance
* @author Fábio Pereira <fabio.pereira.gti@gmail.com>
*/
const interface_chat = (io, stream) =>{

  const fnReport = user => console.log('Usuários ativos: ', user.getArray());

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

      fnReport(user);
    });

    // send message
    socket.on('send-message', (data) => {
      saveSQL(data);
      user.isOnline(data.receiver).online
          ? user.sendTo(data.receiver, data)
          : user.saveQueue(data.receiver, data);
    });

    socket.on('online-list', (data)=>{
      User.prototype.checkListOnline.call(this, data).then(
          res => socket.emit('online-list-result', res)
      ).catch(
          err => socket.emit('online-list-result', err)
      );
    });

    // send message
    stream(socket).on('send-file', (socketStream, data) => {
      User.prototype.saveFile.call(this, socketStream, data, stream(socket));
    });

    // disconnect
    socket.on('disconnect', () => {
      User.prototype.offline.call(this, socket.user_id);
      user ? fnReport(user) : null;
    });
  });
};

module.exports = interface_chat;
