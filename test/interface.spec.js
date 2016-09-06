'use strict';
const assert = require('chai').assert;
const io = require('socket.io-client');
const chat = require('../core/interface');

const socketURL = 'http://0.0.0.0:3000';

const options ={
  transports: ['websocket'],
  'force new connection': true
};

describe("Interface Chat", () => {

  describe("Nova conexão é criada ", () => {
    it('Solicita informações ao cliente',(done) => {
      const client = io.connect(socketURL, options);
      client.on('connection', (data) => {
        assert.deepEqual({status: true}, data);
        done();
      });
    });

    it('Devolução das informações feita pelo cliente',(done) => {
      const client = io.connect(socketURL, options);
      client.on('connection', (data) => {
        client.emit('connection-accepted', {id: 1});
        done();
      });
    });
  });


  describe("Nova conexão é aceita ", () => {

    const client = io.connect(socketURL, options);
    const client2 = io.connect(socketURL, options);

    it('Conexão foi aceita',() => {

      client.on('connection', (data) => {
        client.emit('connection-accepted', {id: 1});
      });

      client.on('connection-on', (data) =>{
        assert.deepEqual({status: true}, data);
      });
    });

    before(()=>{
      client.on('connection', (data) => {
        client.emit('connection-accepted', {id: 1});
      });

      client2.on('connection', (data) => {
        client2.emit('connection-accepted', {id: 2});
      });

      client.on('connection-on', (data) =>{
        client.emit('send-msg', {id: 2, msg: "Hello gays !"});
      });

    });

    it('Envio de mensagem',() => {
      client2.on('msg', (data) =>{
        assert.deepEqual({id: 2, msg: "Hello gays !"}, data);
      });
    });

  });
});
