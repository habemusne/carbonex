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
        




      var schedule = [
        [],[],[],[],[],[],[]
      ];

      courseList = $rootScope.courses["CourseList"]["course"];

      for (i = 0; i < courseList.length; ++i){
        for (j = 0; j < courseList[i]["MeetingType"].length; ++j){
          meeting = {};
          if (courseList[i]["MeetingType"][j]["-class"] === "FI"){
            continue;
          }

          if (courseList[i]["MeetingType"][j]["Days"].indexOf("M") > -1){
            meeting["courseNumber"] = courseList[i]["courseNumber"];
            meeting["MeetingType"] = courseList[i]["MeetingType"][j];
            schedule[0].push(meeting);
          }
          if (courseList[i]["MeetingType"][j]["Days"].indexOf("T") > -1){
            if (((courseList[i]["MeetingType"][j]["Days"].match(/T/g)||[]).length - 1) == 2){
              meeting["courseNumber"] = courseList[i]["courseNumber"];
              meeting["MeetingType"] = courseList[i]["MeetingType"][j];
              schedule[1].push(meeting);
            }
            else if (courseList[i]["MeetingType"][j]["Days"].indexOf("Th") == -1){
              meeting["courseNumber"] = courseList[i]["courseNumber"];
              meeting["MeetingType"] = courseList[i]["MeetingType"][j];
              schedule[1].push(meeting);
            }
          }
          if (courseList[i]["MeetingType"][j]["Days"].indexOf("W") > -1){
            meeting["courseNumber"] = courseList[i]["courseNumber"];
            meeting["MeetingType"] = courseList[i]["MeetingType"][j];          
            schedule[2].push(meeting);
          }
          if (courseList[i]["MeetingType"][j]["Days"].indexOf("Th") > -1){
            meeting["courseNumber"] = courseList[i]["courseNumber"];
            meeting["MeetingType"] = courseList[i]["MeetingType"][j];
            schedule[3].push(meeting);
          }
          if (courseList[i]["MeetingType"][j]["Days"].indexOf("F") > -1){
            meeting["courseNumber"] = courseList[i]["courseNumber"];
            meeting["MeetingType"] = courseList[i]["MeetingType"][j];
            schedule[4].push(meeting);
          }
        }
      }

      for (i = 0; i < schedule.length; ++i){
        schedule[i].sort(function(meetingA, meetingB){
          if (parseInt(meetingA["MeetingType"]["Time"].substring(0, 2))
            < parseInt(meetingB["MeetingType"]["Time"].substring(0, 2))) {
            return -1;
          } else if (parseInt(meetingA["MeetingType"]["Time"].substring(0, 2))
            > parseInt(meetingB["MeetingType"]["Time"].substring(0, 2))) {
            return 1;
          } else {
            return 0;
          }
        });
      }

      DayElements = [];
      DayElements.push(document.getElementById("tablediv-mon"));
      DayElements.push(document.getElementById("tablediv-tue"));
      DayElements.push(document.getElementById("tablediv-wed"));
      DayElements.push(document.getElementById("tablediv-thu"));
      DayElements.push(document.getElementById("tablediv-fri"));

      SCHEDULE_DAY_TOTAL_MINUTE = 720; //12 hours * 60 minutes
      SCHEDULE_DAY_START_HOUR = 8;
      SCHEDULE_DAY_TOTAL_HOUR = 12;
      SCHEDULE_HTML_CELL_HEIGHT = 563; //563px, .tablediv-container

      console.log(schedule);

      for (i = 0; i < DayElements.length; ++i){
        for (j = 0; j < schedule[i].length; ++j){
          time = schedule[i][j]["MeetingType"]["Time"];
          startTime_base10 = parseFloat(time.substring(0, 2))
            + parseFloat(time.substring(3, 5)) / 60.0;
          diff = startTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameStartY = (diff / SCHEDULE_DAY_TOTAL_HOUR)
            * SCHEDULE_HTML_CELL_HEIGHT;

          endTime_base10 = parseFloat(time.substring(6, 8))
            + parseFloat(time.substring(9, 11)) / 60.0;
          diff = endTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameEndY = (diff / SCHEDULE_DAY_TOTAL_HOUR)
            * SCHEDULE_HTML_CELL_HEIGHT;

          height = frameEndY - frameStartY;

          div = document.createElement('DIV');
          text = document.createTextNode(schedule[i][j]["courseNumber"]); 
          div.appendChild(text);
          DayElements[i].appendChild(div);

          //Expected: append a new created div element to DayElements[i].
          //  This div should have min-height = height and
          //  margin-top = frameStartY

        }
      }








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


