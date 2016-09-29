'use strict';
const assert = require('chai').assert;
const it = require('mocha').it;
const describe = require('mocha').describe;
const saveQueue = require('../core/saveQueue');

describe('Salva dados na fila do radis', ()=>{

  it('Salvar dados', ()=>{
    const saved = saveQueue(2, {message: 'Hello world'});
    assert.isTrue(saved, 'Saved não é true.');
  });

});
