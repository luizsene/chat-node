'use strict';
const fs = require('fs');

const _callback = (file) =>{
  fs.unlink(file);
};

const _timer = (fileDate, filename) =>{

  if(typeof fileDate === 'string')
    fileDate = parseInt(fileDate);

  const now = new Date();
  const date = new Date(fileDate);

  const utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  Math.floor((utc2 - utc1)/( 1000 * 60 * 60 * 24)) > 15 ? _callback(filename) : null;
};

module.exports = _timer
