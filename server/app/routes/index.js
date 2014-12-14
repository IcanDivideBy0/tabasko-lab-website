'use strict';

var _ = require('lodash');
var express = require('express');

var app = module.exports = new express.Router();


// Client routes
_.each([
  '/',
  '/home',
  '/contact'
], function (path) {
  app.get(path, function (req, res) {
    res.render('index');
  });
})
