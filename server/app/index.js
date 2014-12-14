'use strict';

var express = require('express');
var errorHandler = require('express-err');
var path = require('path');
var ejs = require('ejs');

/**
 * Create and expose app.
 */

var app = module.exports = express();

// Setup templates engine.
app.engine('hbs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'templates', 'layouts'));

// Setup static client files.
app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')));

// Middlewares.
app.use(require('./middlewares/env'));
app.use(require('./middlewares/package'));

// Application routes.
app.use(require('./routes'));

// Error handling.
app.use(errorHandler.httpError(404));
app.use(errorHandler({ view: 'error' }));
