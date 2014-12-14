'use strict';

var app = require('./app');
var config = require('./config');

module.exports = createServer();

function createServer () {
  var server = app.listen(config.get('server:port'), function () {
    console.log('Listening on port %d', server.address().port);
  });
}
