'use strict';

var _ = require('lodash');
var angular = require('angular');

angular
.module('mainApp', [
  require('angular-animate').name,
  require('angular-aria').name,
  require('angular-material').name,
  require('ui-router').name,
  require('./home').name,
  require('./contact').name
])
.config([
  '$locationProvider',
  '$stateProvider',
  function ($locationProvider, $stateProvider) {
    // Configure location provider to use history API.
    $locationProvider.html5Mode(true);

    // Root route for global layout.
    $stateProvider
      .state('root', {
        url: '/',
        template: require('./index.html'),
        abstract: true
      });
  }
])
.controller('MainAppController', [
  '$rootScope',
  '$scope',
  '$timeout',
  '$state',
  '$mdSidenav',
  function ($rootScope, $scope, $timeout, $state, $mdSidenav) {
    $scope.$state = $state;
    $scope.$mdSidenav = $mdSidenav;

    $scope.menu = [
      { stateName: 'root.home', label: 'Home' },
      { stateName: 'root.contact', label: 'Contact' }
    ];

    $rootScope.$on('$stateChangeStart',
      function updateSlideDirection(event, toState, toParams, fromState, fromParams) {
        _.each($scope.menu, function (menuEntry) {
          if (fromState.name === menuEntry.stateName) {
            $scope.slideDirection = 'forward';
            return false;
          }

          if (toState.name === menuEntry.stateName) {
            $scope.slideDirection = 'backward';
            return false;
          }
        });

        // We need a digest loop to apply class change in template before
        // changing the route for annimations to work correctly.
        event.preventDefault();
        $timeout(function () {
          // See https://github.com/angular-ui/ui-router/issues/178#issuecomment-49156829
          $state.go(toState.name, toParams, {notify: false}).then(function() {
            $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
          });
        })
      }
    );

    $rootScope.$on('$stateChangeSuccess', function updateCurrentStateIndex() {
      $scope.currentStateIndex = _.findIndex($scope.menu, function (menuEntry) {
        return $state.includes(menuEntry.stateName);
      });
    });
  }
]);
