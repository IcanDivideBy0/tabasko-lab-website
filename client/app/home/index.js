'use strict';

var angular = require('angular');

module.exports = angular.module('home', [
  require('angular-material').name,
  require('ui-router').name
])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.home', {
        url: 'home',
        template: require('./index.html')
      });

    // Global default page for the whole app.
    $urlRouterProvider.otherwise('/home');
  }
]);
