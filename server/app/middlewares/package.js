'use strict';

var _ = require('lodash');
var express = require('express');
var packageInfos = require('../../../package.json');

var app = module.exports = express();

app.use(function (req, res, next) {
  res.locals = _.merge(res.locals || {}, { 'package': packageInfos });
  next();
});
