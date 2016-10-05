'use strict';
const fs = require('fs');
const UPLOAD = require('./constantes').UPLOADED_FILES;
const clearFiles = require('./clearFiles');
const _interval = () =>{
  return setInterval(()=>{
    fs.readdir(UPLOAD, (err, files)=>{
      if(err) throw err;
      if(files && files.length){
        files.forEach((item)=>{
          clearFiles(item.split('.').shift(), (UPLOAD + item));
        });
      }
    });
  }, (1000 * 60 * 60 * 24));
};
module.exports = _interval
