'use strict';
const assert = require('chai').assert;
const it = require('mocha').it;
const describe = require('mocha').describe;
const before = require('mocha').before;
const saveQueue = require('../core/saveQueue');
const checkQueue = require('../core/checkQueue');

describe('Busca dados na fila do redis', ()=>{

  before(() => saveQueue(2, {message: 'Hello world'}));

  it('Busca dados existentes', (done)=>{
    checkQueue(2).then((res) => {
      assert.deepEqual({message: 'Hello world'}, res[0]);
      done();
    }).catch((err) => {
      done();
      throw err;
    });
  });

  it('Busca dados inexistentes', (done)=>{
    checkQueue(10).then((res) => {
      assert.equal(null, res);
      done();
    }).catch((err)=>{
      done();
      throw err;
    });
  });

});
