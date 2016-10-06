'use strict';
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  console.log("Numero de core: ", numCPUs);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

} else {
    require("./app.js");
}
