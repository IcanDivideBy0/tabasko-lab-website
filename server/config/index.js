var nconf = require('nconf');
var path = require('path');

module.exports = nconf.argv().env()
  .file('default', path.join(__dirname, '..', '..', 'config', 'config.json'))
  .file('env',     path.join(__dirname, '..', '..', 'config', 'config.' + process.env.NODE_ENV + '.json'));
