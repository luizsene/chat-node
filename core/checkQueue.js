'use strict';

const redisClient = require('./redis');
const base64 = require('./base64');

const _callback = (err, reply) => {
  return !err && reply && reply.length > 0 ? reply : err;
};

const _exist = (id) => redisClient.exists(id, (err, reply) => reply === 1);

const fnCheckQueue = (id)=>{
  return new Promise((resolve)=>{
    if(_exist(base64(id))){
      redisClient.lrange(base64(id), 0, -1, (err, reply)=>{
        resolve(_callback(err, reply));
      });
    }
  });
};

module.exports = fnCheckQueue;
