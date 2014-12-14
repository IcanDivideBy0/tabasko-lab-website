'use strict';

var angular = require('angular');

module.exports = angular.module('contact', [
  require('angular-material').name,
  require('ui-router').name
])
.config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('root.contact', {
        url: 'contact',
        template: require('./index.html')
      });
  }
]);
