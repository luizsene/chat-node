'use strict';
const online_list = {};

let self;

const base64 = (id, decode) => require('./base64')(id, decode);

function User(socket, data) {
  self = this;

  if(typeof socket !== 'object' || !socket)
    return new TypeError('Socket cannot be null');

  if(typeof data !== 'object' || !data || !data.id)
    return new TypeError('Data cannot be null');

  socket.user_id = data.id;
  online_list[base64(data.id)] = socket;

  return self;
}

User.prototype.getUser = (id) => {
  return online_list[base64(id)] ? online_list[base64(id)] : null;
};

User.prototype.isOnline = (id) => {
  return self.getUser(id) ? {online: true} : {online: false};
};

User.prototype.offline = function (id) {
  delete online_list[base64(id)];
};

User.prototype.getSize = function () {
  return Object.keys(online_list).length;
};

User.prototype.getArray = function () {
  return Object.getOwnPropertyNames(online_list)
  .map((key) => parseInt(base64(key, true)));
};

User.prototype.sendTo = (id, data) =>{
  const socketUser = self.getUser(id);

  if(socketUser)
  socketUser.emit('message', data);
  else
  socketUser.saveQueue(data);

  return true;
};

module.exports = User;
