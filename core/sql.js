'use strict';
const conn = require('./mysql');

module.exports = (data) =>{
  const sql = 'INSERT INTO historico_mensagem (destinatario, remetente,' +
      ' data, mensagem, tipo) VALUES (?,?,now(), ?,?);';

  conn.query(sql, [data.receiver, data.sender, data.message, 0], (err, rows)=>{
    if(err) return err;
    return rows;
  });
};