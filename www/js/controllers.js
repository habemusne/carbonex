angular.module('ionic-http-auth.controllers', [])
.controller('AppCtrl', function($scope, $state, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/login.html', function(modal) {
    $scope.loginModal = modal;
  },
  {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }
  );
  //Be sure to cleanup the modal by removing it from the DOM
  $scope.$on('$destroy', function() {
    $scope.loginModal.remove();
  });
})

.controller('LoginCtrl', function($scope, $http, $state, AuthenticationService) {
  $scope.message = "";
  
  $scope.user = {
    username: null,
    password: null
  };

  $scope.login = function() {
    AuthenticationService.login($scope.user);
  };

  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    $scope.loginModal.show();
  });

  $scope.$on('event:auth-loginConfirmed', function() {
   $scope.username = null;
   $scope.password = null;
   $scope.loginModal.hide();
 });
  
  $scope.$on('event:auth-login-failed', function(e, status) {
    var error = "Login failed.";
    if (status == 401) {
      error = "Invalid Username or Password.";
    }
    $scope.message = error;
  });

  $scope.$on('event:auth-logout-complete', function() {
    console.log("logout complete");
  });
})

.controller('HomeCtrl', function($rootScope, $scope, $timeout) {
  $scope.$on('$ionicView.enter', function() {
    $timeout(function(){
      //Broadcast that login is required.
      $rootScope.$broadcast('event:auth-loginRequired');
      //Display essential elements
      $scope.week = [{name:'Monday'},{name:'Tuesday'},{name:'Wednesday'},{name:'Thursday'},{name:'Friday'},{name:'Saturday'},{name:'Sunday'}];
      $scope.day = []
      var oclock = 8;
      for (var i = 0; i <= 12; i++) {
        $scope.day.push({hour:oclock.toString(),minute:'00'});
        oclock = oclock + 1;
        //Change Title

      };
    });

    $scope.$on('$ionicView.afterEnter',function(){
      location.assign("#/app/home");
      console.log(document);
      //Change Title
      var d = new Date();
      var dayinweek = d.getDay();
      console.log("dayinweek: "+dayinweek);
      if (dayinweek == 0) dayinweek = 7
        var currentHour = d.getHours();
      console.log("Current day: " + dayinweek + "currentHour:" + currentHour);
    //   if (currentHour >= 8 && currentHour < 24) 
    //   {
    //    var x = document.getElementById("classtable").rows;
    //    //console.log(x[1].cells);
    //    x[currentHour-7].style.backgroundColor = 'lightblue';
    //    for(var i = 8; i< 24; i++)
    //    {
    //     console.log(x%2);
    //     x[i-7].cells[dayinweek].style.backgroundColor = ((i%2)==0 ) ? 'lightblue' : "lightgray";
    //   }
    //   x[currentHour-7].cells[dayinweek].innerHTML = "HERE";
    // }
  })
  });

})

.controller('CourseCtrl', function($scope, $rootScope, $state, $http) {
  $scope.$on('$ionicView.afterEnter',function(){
    $scope.courses = $rootScope.courses;
    console.log("Courses:"+$scope.courses);
    
  })
  

  // $http.get('https://courses')
  // .success(function (data, status, headers, config) {
  //   $scope.customers = data;
  // })
  // .error(function (data, status, headers, config) {
  //   console.log("Error occurred.  Status:" + status);
  // });
})
.controller('AddCourseCtrl', function($scope,$rootScope, $state, $http,AuthenticationService) {
  $scope.candidates = [];
  $scope.$watch('candidates',function(){
    console.log($scope.candidates);
  });
  $scope.search = function(){
     $scope.keyword = "Econ";
     AuthenticationService.search($scope.keyword);
     $scope.candidates = $rootScope.candidates;
     console.log("rootScope candidates: "+$rootScope.candidates);
    };
  $scope.$on('$ionicView.afterEnter',function(){
    
  });

  

})

.controller('LogoutCtrl', function($scope, AuthenticationService) {
  AuthenticationService.logout();
})




