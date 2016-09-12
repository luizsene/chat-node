'use strict';
const assert = require('chai').assert;
const describe = require('mocha').describe;
const it = require('mocha').it;
const after = require('mocha').after;
const io = require('socket.io-client');
const User = require('../core/user');
const redisClient = require('../core/redis');
const Promise = require('promise');

const socketURL = 'http://0.0.0.0:3000';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Users', () => {

  const client = io.connect(socketURL, options);
  const client2 = io.connect(socketURL, options);
  const user = new User(client, {id: 1});
  const user2 = new User(client, {id: 2});


  after(() => {
    client.disconnect();
    client2.disconnect();
  });

   /* Apaga todo o banco Redis*/
  after(()=>{
    redisClient.keys('*', (err, keys) => {
      keys.forEach((key) => {
        redisClient.del(key, ()=> null);
      });
    });
  });


  it('Socket não é definido', () => {
    const user_erro = new User(null, {id: 3});
    assert.isDefined('Socket cannot be null', user_erro.message);
  });

  it('Dados do usuário não é definido', ()=> {
    const user_erro = new User(client, null);
    assert.isDefined('Data cannot be null', user_erro.message);
  });

  it('Criação de um novo usuário', (done)=> {
    assert.isDefined(user, 'User não é definido');
    done();
  });

  it('Número de usuário', (done)=> {
    assert.equal(2, user.getSize(), 'O número de usuários não está correto.');
    done();
  });

  it('Array de usuários', (done)=> {
    assert.deepEqual([1, 2], user.getArray());
    done();
  });

  it('Está online', ()=> {
    assert.deepEqual({online: true}, user.isOnline(2), 'Usuário não está online');
  });

  it('Não está online', ()=> {
    assert.deepEqual({online: false}, user.isOnline(4), 'Usuário está online');
  });

  it('Envia mensagem usuário online', ()=> {
    user.sendTo(2, {message: 'Olá como vai ?'});
    client2.on('message', (data)=> {
      assert.deepEqual({message: 'Olá como vai ?'}, data);
    });
  });

  it('Salva mensagem na fila do redis', (done)=>{
    const myUser = new User(client, {id: 10});
    const saved = myUser.saveQueue(4, {message: 'Olá mundo redis'});
    assert.deepEqual(true, saved);
    done();
  });

  it('Recupera mensagem na fila do redis', ()=>{

    const myUser = new User(client, {id: 4});
    Promise.all([myUser.checkQueue(4)]).then((res)=>{
      const resParsed = res.map(JSON.parse);
      assert.deepEqual({message: 'Olá mundo redis'}, resParsed[0]);
    });
  });

  it('Usuário desconectado', (done)=> {
    user.offline(1);
    user2.offline(2);
    assert.deepEqual({online: false}, user.isOnline(1));
    assert.deepEqual({online: false}, user.isOnline(2));
    done();
  });

});
