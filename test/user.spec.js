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

describe("Users", () => {

    const client = io.connect(socketURL, options);
    const client2 = io.connect(socketURL, options);
    let user = new User(client, {id: 1});
    let user2 = new User(client, {id: 2});

    it("Socket não é definido", () => {
      const user_erro = new User(null, {id: 3});
      assert.isDefined('Socket cannot be null', user_erro.message);
    });

    it("Dados do usuário não é definido", ()=>{
      const user_erro = new User(client, null);
      assert.isDefined('Data cannot be null', user_erro.message);
    });

    it("Criação de um novo usuário", (done)=>{
      assert.isDefined(user, "User não é definido");
      done();
    });

    it("Número de usuário", (done)=>{
      assert.equal(2, user.getSize(), "O número de usuários não está correto.");
      done();
    });

    it("Array de usuários", (done)=>{
      assert.deepEqual([1, 2], user.getArray());
      done();
    })

    it("Está online", ()=>{
      assert.deepEqual({online: true}, user.isOnline(2), "Usuário não está online");
    })

    it("Não está online", ()=>{
      assert.deepEqual({online: false}, user.isOnline(4), "Usuário está online");
    })

    it("Envia mensagem", ()=>{
      user.sendTo(2, {message: "Olá como vai ?"});
      client2.on('message', (data)=>{
        assert.deepEqual( {message: "Olá como vai ?"}, data);
      })
    })

    it("Usuário desconectado", ()=>{
      user.offline(1);
      user.offline(2);
      assert.deepEqual({online: false}, user.isOnline(1));
      assert.deepEqual({online: false}, user.isOnline(2));
      assert.equal(0, user.getSize(), "O número de usuários não está correto.");
    });
});
