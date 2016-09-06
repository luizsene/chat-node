'use strict';
module.exports = (id, decode) => {
  if(!id) return new TypeError('Id cannot be null');
  if(typeof id === 'object') return new TypeError('Id cannot be object');

  if(!decode)
    return new Buffer(String(id)).toString('base64');
  else
    return new Buffer(id, 'base64').toString();
};
