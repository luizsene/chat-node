'use strict';

const checkQueue = require('./checkQueue');
const saveQueue = require('./saveQueue');

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
        online: self.isOnline(list[i]).online
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
  let retorno;

  if(socketUser){
    socketUser.emit('message', data);
  } else {
    Notification.prototype.send.call(
       this,
       Notification.prototype.formatMessage.call(this, data), (err, data)=>{
         retorno = err || data;
       }
    );
  }
  return retorno;
};

User.prototype.sendFileTo = (id, stream, data)=>{
    console.log("Meu streaming:> ",stream);
};

User.prototype.checkQueue = (id) =>{
  const socketUser = self.getUser(id);

  if(socketUser)
    checkQueue(id, self).then((res) =>
                res.forEach((resItem)=> self.sendTo(id, resItem)))
                            .catch((err) => err);
};

User.prototype.saveQueue = (id, data) =>{
  return id && data ? saveQueue(id, data) : null;
};

module.exports = User;
