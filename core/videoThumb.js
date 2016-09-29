'use strict';
const ffmpeg = require('fluent-ffmpeg');
const UPLOAD = require('./constantes').UPLOADED_FILES;

const _generateThumb = (uri) =>{
  const relativeUri = UPLOAD + uri;
  const name  = (uri).replace('mp4', 'png');
  return new Promise((resolve, reject)=>{
    try {
      ffmpeg(relativeUri).takeScreenshots({
        count: 1,
        filename: name
      }, UPLOAD, (err)=>{
        if(err) reject(err);
        resolve();
      });
      resolve();
    }catch (err){
      reject(err);
    }
  });
};

module.exports = _generateThumb;
