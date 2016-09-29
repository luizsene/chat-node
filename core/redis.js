'use strict';

const redis = require('redis');

const client = redis.createClient();

client.on('connect', ()=>{
  console.log('connected to redis');
});

client.on('error', ()=>{
  console.log('Sorry, cannot connect to Redis.');
});


module.exports = client;