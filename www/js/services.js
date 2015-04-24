angular.module('ionic-http-auth.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend) {
  var service = {
    login: function(user) {
      
},

logout: function(user) {
  $http.post('https://logout', {}, { ignoreAuthModule: true })
  .finally(function(data) {
    delete $http.defaults.headers.common.Authorization;
    $rootScope.$broadcast('event:auth-logout-complete');
    $rootScope.authorized = false;
  });			
},	
loginCancelled: function() {
  authService.loginCancelled();
  $rootScope.authorized = false;


},

search:function(keyword)
{
  console.log("searching for courses with keyword"+keyword);
  $http({
    url:'http://52.10.74.192/blog/searchsection.php?keyword='+keyword,
    method:   "GET",
  })
  .success(function (data, status, headers, config) {
    $rootScope.candidates = data;
    console.log("search course successful, courses list"+$rootScope.candidates);
  })
  .error(function (data, status, headers, config) {
    console.log("Error occurred.  Status:" + status);
  });
}
};
return service;
})


