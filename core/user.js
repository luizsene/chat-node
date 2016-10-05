'use strict';

const checkQueue = require('./checkQueue');
const saveQueue = require('./saveQueue');
const cleanQueue = require('./cleanQueue');
const fs = require('fs');
const videoThumb = require('./videoThumb');
const UPLOAD = require('./constantes').UPLOADED_FILES;

/**
* List of all users online
* @member {Object}
* @memberof User
*/
const online_list = {};

/**
* Proxy variable
* @member {Object}
* @memberof User
*/
let self;

/**
* Encode and decode to base64
* @member {Object} base64
* @memberof User
*/
const base64 = (id, decode) => require('./base64')(id, decode);

const Notification = require('./notification');

/**
 * Creates a new User.
 * @namespace
 * @class
 * @param {Object} socket - Socket.io instance
 * @param {Object} data - User data
 * @author Fábio Pereira <fabio.pereira.gti@gmail.com>
 */
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

/**
* Get user by id
* @function
* @name getUser
* @param {int} id - user id
* @memberof User
* @returns {Object}
*/
User.prototype.getUser = (id) => {
  return online_list[base64(id)] ? online_list[base64(id)] : null;
};

/**
* Verify if user is online or no
* @function
* @name isOnline
* @param {int} id - user id
* @memberof User
* @returns {Object}
*/
User.prototype.isOnline = (id) => {
  return self.getUser(id) ? {online: true} : {online: false};
};

User.prototype.checkListOnline = (list) =>{
  const new_list = [];
  return new Promise(resolve =>{
    let i = 0;
    while (i < list.length){
      new_list.push({
        id: list[i].id,
        posicao:list[i].posicao,
        online: self.isOnline(list[i].id).online
      });
      i++;
    }
    resolve(new_list);
  });
};

/**
* Remove instance of user
* @function
* @name isOnline
* @param {int} id - user id
* @memberof User
*/
User.prototype.offline = (id) => {
  delete online_list[base64(id)];
};

/**
* Get number of user exist connected
* @function
* @name getSize
* @memberof User
*/
User.prototype.getSize = () => {
  return Object.keys(online_list).length;
};

/**
* Get array id of all online users
* @function
* @name getArray
* @memberof User
* @returns {Array}
*/
User.prototype.getArray = () => {
  return Object.getOwnPropertyNames(online_list)
  .map((key) => parseInt(base64(key, true)));
};

/**
* Send message
* @function
* @name sendTo
* @param {int} id - User id
* @param {Object} data - Data of message
* @memberof User
* @returns {Boolean}
*/
User.prototype.sendTo = (id, data) =>{
  const socketUser = self.getUser(id);
  socketUser.emit('message', data);
};


User.prototype.checkQueue = (id) =>{
  const socketUser = self.getUser(id);
  if(socketUser){
    checkQueue(id, self).then((res) =>
      res.forEach((resItem)=> self.sendTo(id, resItem)))
        .catch((err) => err);
    cleanQueue(id);
  }
};

User.prototype.saveQueue = (id, data) =>{
  const nt = new Notification();
  nt.send(nt.formatMessage(data), (err, res)=>{});
  return id && data ? saveQueue(id, data) : null;
};


User.prototype.saveFile = (socketStream, data) => {
  const filename  =  Date.now() + '.' + data.extension;
  const fileStream = fs.createWriteStream((UPLOAD + filename));
  socketStream.pipe(fileStream);
  const info = {
    filename: filename,
    sender: data.sender,
    receiver: data.receiver,
    sender_login: data.sender_login,
    receiver_login: data.receiver_login,
    message: null,
    date: Date.now(),
    type: data.type
  };
  return info;
};

User.prototype.finishUpload = (filename, info) =>{

  const callback = () =>{
    User.prototype.isOnline.call(this, info.receiver).online
        ? User.prototype.sendTo.call(this, info.receiver, info)
        : User.prototype.saveQueue.call(this, info.receiver, info);
  }
  if(info.type === 0){
    videoThumb(filename).then(function () {
      callback();
    }).catch((err)=>{
      throw err;
    });
  }else{
    callback();
  }
};

module.exports = User;
