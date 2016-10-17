'use strict';
const assert = require('chai').assert;
const describe = require('mocha').describe;
const it = require('mocha').it;
const after = require('mocha').after;
const before = require('mocha').before;
const io = require('socket.io-client');
const User = require('../core/user');


const socketURL = 'http://0.0.0.0:1234';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Interface Chat', () => {


  describe('Nova conexão é criada ', () => {

    // it('Solicita informações ao cliente',(done) => {
    //   const client = io.connect(socketURL, options);
    //
    //   after(() =>{
    //     client.disconnect();
    //   });
    //
    //   client.on('connection', (data) => {
    //     assert.deepEqual({status: true}, data);
    //     done();
    //   });
    // });

    it('Devolução das informações feita pelo cliente',(done) => {
      const client = io.connect(socketURL, options);

      after(()=>{
        client.disconnect();
      });

      client.on('connection', () => {
        client.emit('connection-accepted', {id: 1});
        done();
      });

    });
  });


  describe('Nova conexão é aceita ', () => {

    const client = io.connect(socketURL, options);
    const client2 = io.connect(socketURL, options);

    after(() =>{
      client.disconnect();
      client2.disconnect();
    });

    it('Conexão foi aceita',() => {

      const client = io.connect(socketURL, options);

      after(() =>{
        client.disconnect();
      });

      client.on('connection', () => {
        client.emit('connection-accepted', {id: 1});
      });

      client.on('connection-on', (data) =>{
        assert.deepEqual({status: true}, data);
      });
    });

    before(()=>{

      const client = io.connect(socketURL, options);
      const client2 = io.connect(socketURL, options);

      client.on('connection', () => {
        client.emit('connection-accepted', {id: 1});
      });

      client2.on('connection', () => {
        client2.emit('connection-accepted', {id: 2});
      });

      client.on('connection-on', () =>{
        client.emit('send-message', {id: 2, message: 'Hello gays !'});
      });

    });

    it('Envio de mensagem',() => {
      after(() =>{
        client.disconnect();
        client2.disconnect();
      });

      client2.on('message', (data) =>{
        assert.deepEqual({id: 2, message: 'Hello gays !'}, data);
      });
    });
  });

  describe('Usuário é desconectado', ()=>{
    const client = io.connect(socketURL, options);

    it('Conexão é finalizada', ()=>{
      const user = new User(client, {id: 1});

      after(() =>{
        client.disconnect();
      });

      client.on('disconnect', ()=>{
        assert.deepEqual({online: false}, user.isOnline(1));
      });
    });
  });

});
