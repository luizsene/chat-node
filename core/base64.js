'use strict';

/**
 * A module that encode or decode to base64
 * @module base64
 * @param {integer | String | Char} value
 * @param {Boolean} decode
 * @returns {String}
 * @author Fábio Pereira <fabio.pereira.gti@gmail.com>
 */
module.exports = (value, decode) => {
  if(!value)
    return new TypeError('Value cannot be null');

  if(typeof value === 'object')
    return new TypeError('Value cannot be object');

  if(!decode)
    return new Buffer(String(value)).toString('base64');
  else
     return new Buffer(value, 'base64').toString();
};
