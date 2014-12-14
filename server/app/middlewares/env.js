'use strict';

var _ = require('lodash');
var express = require('express');

var app = module.exports = express();

app.use(function (req, res, next) {
  res.locals = _.merge(res.locals || {}, { env: process.env });
  next();
});
