'use strict';
const assert = require('chai').assert;
const io = require('socket.io-client');
const chat = require('../core/interface');
const User = require('../core/user');


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
        client.emit('send-message', {id: 2, message: "Hello gays !"});
      });

    });

    it('Envio de mensagem',() => {
      client2.on('message', (data) =>{
        assert.deepEqual({id: 2, message: "Hello gays !"}, data);
      });
    });
  });

  describe("Usuário é desconectado", ()=>{
    it("Conexão é finalizada", ()=>{

      const client = io.connect(socketURL, options);
      const user = new User(client, {id: 1});

      client.on('disconnect', (data)=>{
        assert.deepEqual(1, data.user_id)
        assert.deepEqual({online: false}, user.isOnline(1));
        assert.equal(0, user.getSize(), "O número de usuários não está correto.");
      })
    })
  });

});
