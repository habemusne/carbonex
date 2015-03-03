angular.module('ionic-http-auth.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend) {
  var service = {
    login: function(user) {
      
      // $http.post('https://yefeiw-pinteresting.herokuapp.com/users/sign_in',{email:user.username,pasword:user.password})
      //$http.post('https://a4.ucsd.edu/tritON/Authn/UserPassword', data)
      $http({
        //url: "http://54.67.92.221/blog/my-login.php",
        //url:"https://www.eventbrite.com/login/"
        url:'/api/getcourses',
        method:   "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])); 
          return str.join("&");
        },
        //params: {'username': user.username},
        //data: {'username':user.username,'password':user.password,'submit':'yes'}
      })
      .success(function (data, status, headers, config) {
        console.log("Login Success: data "+ data + "status: " + status);
    	  
        $rootScope.courses = data;
        console.log($rootScope.courses);

        $http.defaults.headers.common.Authorization = data.authorizationToken;  // Step 1
    	  // Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.authorizationToken;
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        console.log("Login Failed with data " + data + ", status " + status + " headers " + headers);
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    },
    
    logout: function(user) {
      $http.post('https://logout', {}, { ignoreAuthModule: true })
      .finally(function(data) {
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });			
    },	
    loginCancelled: function() {
      authService.loginCancelled();
    }
  };
  return service;
})