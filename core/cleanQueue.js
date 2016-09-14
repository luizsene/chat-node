'use strict';

const base64 = require('./base64');
const redisClient = require('./redis');

const _cleanQueue = (id) =>{
  redisClient.del(base64(id),()=> null);
};

module.exports = _cleanQueue;
