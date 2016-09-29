'use strict';

const assert = require('chai').assert;
const base64 = require('../core/base64');
const describe = require('mocha').describe;
const it = require('mocha').it;

describe('Base64', () => {

  describe('Valor não nulo', ()=>{
    it('Retorna definido', ()=>{
      assert.isDefined(base64(1), 'Valor não é definido');
    });

    it('Retorna valor correto encode', ()=>{
      assert.equal('MQ==', base64(1), 'Valores não correspondem');
    });

    it('Retorna valor correto decode', ()=>{
      assert.equal(1, base64('MQ==', true), 'Valores não correspondem');
    });

    it('Id não pode ser object', ()=>{
      assert.deepEqual(new TypeError('Id cannot be object'), base64({}));
    });
  });

  describe('Valor nulo', ()=>{
    it('Retorna definido', ()=>{
      assert.deepEqual(new TypeError('Id cannot be null'), base64(null));
    });
  });
});
