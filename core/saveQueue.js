'use strict';

const redisClient = require('./redis');
const base64 = require('./base64');

const _callback = (err, reply) =>{
  return err ? err : reply;
};

const fnSaveQueue = (id, data)=>{
  return redisClient.rpush([base64(id), JSON.stringify(data)], (err, reply) =>{
    return _callback(err, reply);
  });
};

module.exports = fnSaveQueue;