// ionic-http-auth was made from the ionic-starter-app sideMenu
// to create a new app, at a command prompt type this: ionic start appname sideMenu

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ionic-http-auth' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ionic-http-auth.controllers' is found in controllers.js
// 'ionic-http-auth.services is' found in services.js
angular.module('ionic-http-auth', ['ionic', 'ngMockE2E', 'ionic-http-auth.services', 'ionic-http-auth.controllers'])

.run(function($rootScope, $ionicPlatform, $httpBackend, $http) {

	$ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();

    }
  });
  
  var week = [{name:'Monday'},{name:'Tuesday'},{name:'Wednesday'},{name:'Thursday'},{name:'Friday'},{name:'Saturday'},{name:'Sunday'}];

  $rootScope.authorized = false;
  $rootScope.user = {
    username: null,
    password: null,
    email:null,
    confirm:null
  };
  $rootScope.courses =[];
   
  $httpBackend.whenPOST('https://logout').respond(function(method, url, data) {
    authorized = false;
    return [200];
  });

  // All other http requests will pass through
  $httpBackend.whenGET(/.*/).passThrough();
  $httpBackend.whenPOST(/.*/).passThrough();


  //$scope.$broadcast(‘event:auth-loginRequired’);


  
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
  
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.home', {
      url: "/home",
	  views: {
	      'menuContent' :{
	          controller:  "HomeCtrl",
	          templateUrl: "templates/home.html"            	
	      }
	  }      	  
    })
    .state('app.courses', {
      url: "/courses",
	  views: {
	      'menuContent' :{
	          controller:  "CourseCtrl",
	          templateUrl: "templates/courses.html"            	
	      }
	  }      	  
    })
    .state('app.playground', {
      url: "/playground",
    views: {
        'menuContent' :{
            controller:  "PlaygroundCtrl",
            templateUrl: "templates/playground.html"             
        }
    }         
    })
    .state('app.logout', {
      url: "/logout",
      views: {
    	   'menuContent' :{
    		   controller: "LogoutCtrl",
           templateUrl: "templates/home.html"
         }
      } 
    });
  $urlRouterProvider.otherwise("/app/home");
});
