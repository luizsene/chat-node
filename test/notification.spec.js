'use strict';
const assert = require('chai').assert;
const Notification = require('../core/notification');

describe("Notification", () => {


  it("Cria uma nova instancia", ()=>{
    const push = new Notification();
    assert.isDefined(push);
    assert.typeOf(push, 'object');
  });

  it("Formata a mensagem para o envio", ()=>{
    const data = {message: "Olá"};
    const message = new Notification().formatMessage(data);
    assert.isDefined(message);
    assert.typeOf(message, 'string');
  });

  it("Recuperar a chave FCM", ()=>{
    const push = new Notification();
    assert.typeOf(push.getFCM(), 'string');
  });

  it("Recuperar a chave Authorization", ()=>{
    const push = new Notification();
    assert.typeOf(push.getAuthorization(), 'string');
  });

  it("Envia uma mensagem", (done)=>{
    const data = {message: "Olá"};
    const push = new Notification();
    const message = push.formatMessage(data);
    push.send(message, (err, data)=>{
      data = JSON.parse(data);
      assert.property(data, 'multicast_id');
      assert.property(data, 'success');
      assert.property(data, 'failure');
      assert.property(data, 'canonical_ids');
      assert.property(data, 'results');
      assert.propertyVal(data, 'success', 1);
      assert.propertyVal(data, 'failure', 0);
      done();
    });
  })

});
