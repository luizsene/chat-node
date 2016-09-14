'use strict';
const mysql = require('mysql');

const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '192.168.0.5',
  user            : 'root',
  password        : 'root',
  database        : 'Servidor_clusbe'
});

module.exports = pool;