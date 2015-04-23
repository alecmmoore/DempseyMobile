// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'dempsey' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var dempsey = angular.module('dempsey', ['ionic'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'views/pages/home.html'
            })
            .state('possession', {
                url: '/possession',
                templateUrl: 'views/pages/possession.html'
            })
            .state('shots', {
                url: '/shots',
                templateUrl: 'views/pages/shots.html'
            })
            .state('passes', {
                url: '/passes',
                templateUrl: 'views/pages/passes.html'
            })
            .state('fouls', {
                url: '/fouls',
                templateUrl: 'views/pages/fouls.html'
            })
            .state('tackles', {
                url: '/tackles',
                templateUrl: 'views/pages/tackles.html'
            })
            .state('subs', {
                url: '/subs',
                templateUrl: 'views/pages/subs.html'
            })
            .state('misc', {
                url: '/misc',
                templateUrl: 'views/pages/misc.html'
            });
            $urlRouterProvider.otherwise('/index')
    })

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs).
        // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
        // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
        // useful especially with forms, though we would prefer giving the user a little more room
        // to interact with the app.
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // Set the statusbar to use the default style, tweak this to
          // remove the status bar on iOS or change it to use white instead of dark colors.
          StatusBar.styleDefault();
        }
      });
    });
