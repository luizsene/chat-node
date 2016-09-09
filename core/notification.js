'use strict';
const http = require('http');
let self;

function Notification() {
  self = this;
  return self;
}

Notification.prototype.formatMessage = function (data) {

  if(!data || data === {} || Array.isArray(data))
    return new TypeError("Data is not object valid");

  const message = {
    notification: {
      title: 'Nova mensagem',
      body: data.message,
      sound: 'default',
      icon: 'icon'
    },
    data: {},
    to: self.getFCM(),
    priority: 'high',
    restricted_package_name: 'br.com.clusbe'
  };
  return JSON.stringify(message);
};

Notification.prototype.getFCM = function () {
  return '';
};

Notification.prototype.getAuthorization = function () {
  return ''
};

Notification.prototype.send = function (message, callbackReq) {

  const options = {
    "method": "POST",
    "hostname": "fcm.googleapis.com",
    "port": null,
    "path": "/fcm/send",
    "headers": {
      "content-type": "application/json",
      "authorization": "key=" + self.getAuthorization(),
      "cache-control": "no-cache",
    }
  };

  const callback = (res) => {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      callbackReq(null, chunk);
    });
  }

  const req = http.request(options, callback);
  req.write(message);
  req.end();

  req.on('error', function (err) {
    callbackReq(err, null);
  });
};


module.exports = Notification;
