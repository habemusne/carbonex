angular.module('ionic-http-auth.services', ['http-auth-interceptor'])
.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend) {
  var service = {
    login: function(user) {
      $http({
        url:'http://52.10.74.192/blog/login.php',
        method:   "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {'username':user.username,'password':user.password,'submit':'yes'}
      })
      .success(function (data, status, headers, config) {
        console.log("Login Success: data " + data + "status: " + status);

        $rootScope.courses = data;
        




        var schedule = [
        [],[],[],[],[],[],[]
        ];

        courseList = $rootScope.courses;
        day2ScheduleIndex = [];
        day2ScheduleIndex['M'] = 0;
        day2ScheduleIndex['Tu'] = 1;
        day2ScheduleIndex['W'] = 2;
        day2ScheduleIndex['Th'] = 3;
        day2ScheduleIndex['F'] = 4;
        day2ScheduleIndex['Sa'] = 5;
        day2ScheduleIndex['Su'] = 6;
        for (i = 0; i < courseList.length; ++i){
          lecture_days = courseList[i]['lecture_day'].split(',');
          for (j = 0; j < lecture_days.length; ++j){
            idx = day2ScheduleIndex[lecture_days[j]];
            meeting = {};
            meeting['type'] = 'LE';
            meeting['time'] = courseList[i]['lecture_time'];
            meeting['room'] = courseList[i]['lecture_room'];
            meeting['courseName'] = courseList[i]['name'];
            schedule[idx].push(meeting);
          }

          discussion_days = courseList[i]['discussion_day'].split(',');
          for (j = 0; j < discussion_days.length; ++j){
            idx = day2ScheduleIndex[discussion_days[j]];
            meeting = {};
            meeting['type'] = 'DI';
            meeting['time'] = courseList[i]['discussion_time'];
            meeting['room'] = courseList[i]['discussion_room'];
            meeting['courseName'] = courseList[i]['name'];
            schedule[idx].push(meeting);
          }
        }


        for (i = 0; i < schedule.length; ++i){
          schedule[i].sort(function(meetingA, meetingB){
            if (parseInt(meetingA["time"].substring(0, 2))
              < parseInt(meetingB["time"].substring(0, 2))) {
              return -1;
          } else if (parseInt(meetingA["time"].substring(0, 2))
            > parseInt(meetingB["time"].substring(0, 2))) {
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
      SCHEDULE_HTML_CELL_HEIGHT = 650; //563px, .tablediv-container

      console.log(schedule);

      for (i = 0; i < DayElements.length; ++i){
        for (j = 0; j < schedule[i].length; ++j){
          time = schedule[i][j]["time"];
          startTime_base10 = parseFloat(time.substring(0, 2))
          + parseFloat(time.substring(3, 5)) / 60.0;
          diff = startTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameStartY = 50 * (diff + 1);

          endTime_base10 = parseFloat(time.substring(6, 8))
          + parseFloat(time.substring(9, 11)) / 60.0;
          diff = endTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameEndY = 50 * (diff + 1);

          height = frameEndY - frameStartY;

          console.log(schedule[i][j]["courseName"] + ': startTime_base10 = ' + startTime_base10 + ', endTime_base10 = ' + endTime_base10 + ', frameStartY  = ' + frameStartY + ', frameEndY = ' + frameEndY + ', height = ' + height);

          div = document.createElement('DIV');
          div.style.minHeight = height.toString() + 'px';
          div.style.maxHeight = height.toString() + 'px';
          div.style.marginTop = frameStartY.toString() + 'px';
          div.style.position = 'absolute';

          courseNumberNode = document.createElement('p');
          BuildingRoomNode = document.createElement('h6');
          //InstructorNode = document.createElement('h6');

          courseNumberText =
          document.createTextNode(schedule[i][j]["courseName"]);
          BuildingRoomText =
          document.createTextNode(schedule[i][j]["room"]);
          //InstructorText = document.createTextNode("");
          MeetingType = schedule[i][j]["type"];
          if (MeetingType == 'LE'){
            // InstructorText =
            //   document.createTextNode(schedule[i][j]["Instructor"]);
            div.className = "lecture-node";
          } else if (MeetingType == 'DI'){
            div.className = "discussion-node";
          }
          courseNumberNode.className = "course-num-text";
          BuildingRoomNode.className = "building-room-text";
          //InstructorNode.className = "instructor-text";

          courseNumberNode.appendChild(courseNumberText);
          BuildingRoomNode.appendChild(BuildingRoomText);
          //InstructorNode.appendChild(InstructorText);
          div.appendChild(courseNumberNode);
          div.appendChild(BuildingRoomNode);
          //div.appendChild(InstructorNode);
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
},

search:function(keyword)
{
  console.log("searching for courses with keyword"+keyword);
  $http({
    url:'http://52.10.74.192/blog/searchsection.php?keyword='+keyword,
    method:   "GET",
        // //headers: {'Content-Type': 'application/json'},
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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


