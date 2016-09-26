'use strict';

const ffmpeg = require('fluent-ffmpeg');

const _generateThumb = (uri) =>{
  uri = '../' + uri;

  const name  = (uri.split('/').pop()).replace('mp4', 'png');

  return new Promise((resolve, reject)=>{
    ffmpeg(uri).takeScreenshots({
      count: 1,
      filename: name
    }, '../files/', (err)=>{
      if(err) reject(err);
      resolve();
    });
  });

};

module.exports = _generateThumb;