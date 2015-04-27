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

.controller('LoginCtrl', function($scope, $rootScope, $http, $state, AuthenticationService) {
  $scope.message = "";
  


  $scope.login = function() {
    //AuthenticationService.login($rootScope.user);
    $http({
      url:'http://52.10.74.192/blog/login.php',
      method:   "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {'username':$rootScope.user.username,'password':$rootScope.user.password,'submit':'yes'}
      })
    .success(function (data, status, headers, config) {
      console.log("Login Success: data " + data + "status: " + status);

      $rootScope.courses = data;
      $rootScope.authorized = true;


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

      colorarray = [['#F1C40F', '#F39C12'],
                    ['#E67E22', '#D35400'],
                    ['#E74C3C', '#C0392B'],
                    ['#1ABC9C', '#16A085'],
                    ['#95A5A6', '#7F8C8D'],
                    ['#2ECC71', '#27AE60'],
                    ['#34495E', '#2C3E50']];

      color_idx = 0;
      for (i = 0; i < courseList.length; ++i){
        lecture_days = courseList[i]['lecture_day'].split(',');
        for (j = 0; j < lecture_days.length; ++j){
          idx = day2ScheduleIndex[lecture_days[j]];
          meeting = {};
          meeting['type'] = 'LE';
          meeting['time'] = courseList[i]['lecture_time'];
          meeting['room'] = courseList[i]['lecture_room'];
          meeting['courseName'] = courseList[i]['name'];
          meeting['color'] = colorarray[color_idx];
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
          meeting['color'] = colorarray[color_idx];
          schedule[idx].push(meeting);
        }
        color_idx = (color_idx + 1) % colorarray.length;
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

          // console.log(schedule[i][j]["courseName"] + ': startTime_base10 = ' + startTime_base10 + ', endTime_base10 = ' + endTime_base10 + ', frameStartY  = ' + frameStartY + ', frameEndY = ' + frameEndY + ', height = ' + height);

          div = document.createElement('DIV');
          div.style.minHeight = height.toString() + 'px';
          div.style.maxHeight = height.toString() + 'px';
          div.style.marginTop = frameStartY.toString() + 'px';
          div.style.position = 'absolute';
          div.style.opacity = 0.3;

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
            div.style.backgroundColor = schedule[i][j]['color'][0];
          } else if (MeetingType == 'DI'){
            div.className = "discussion-node";
            div.style.backgroundColor = schedule[i][j]['color'][1];
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










      $rootScope.$broadcast('event:auth-loginConfirmed', data);
    })
.error(function (data, status, headers, config) {
  console.log("Login Failed with data " + data + ", status " + status + " headers " + headers);
  $rootScope.$broadcast('event:auth-login-failed', status);
});
};

$scope.$on('event:auth-loginRequired', function(e, rejection) {
  $scope.loginModal.show();
});

$scope.$on('event:auth-loginConfirmed', function() {
    //Commenting out because we want to buffer rootScope username and password
   // $scope.username = null;
   // $scope.password = null;
   $scope.loginModal.hide();
 });

$scope.$on('event:auth-login-failed', function(e, status) {
  var error = "Login failed.";
  if (status == 401) {
    error = "Invalid Username or Password.";
  }
  else if(status == 400) {
    error = "Username not found";
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
      if($rootScope.authorized == false){
        $rootScope.$broadcast('event:auth-loginRequired');
      }
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
      //Change Title
      var d = new Date();
      var dayinweek = d.getDay();
      console.log("dayinweek: "+dayinweek);
      if (dayinweek == 0) dayinweek = 7
        var currentHour = d.getHours();
      console.log("Current day: " + dayinweek + "currentHour:" + currentHour);
      if (currentHour >= 8 && currentHour < 24) 
      {
       var x = document.getElementById("classtable").rows;
       x[0].cells[dayinweek].style.backgroundColor = 'lightblue';
       console.log(x[0].cells);


     }


     var schedule = [
     [],[],[],[],[],[],[]
     ];

     courseList = $rootScope.courses;
     console.log("Current course list" + courseList);
     document.getElementById("tablediv-mon").innerHTML = "";
     document.getElementById("tablediv-tue").innerHTML = "";
     document.getElementById("tablediv-wed").innerHTML = "";
     document.getElementById("tablediv-thu").innerHTML = "";
     document.getElementById("tablediv-fri").innerHTML = "";
     document.getElementById("tablediv-sat").innerHTML = "";
     document.getElementById("tablediv-sun").innerHTML = "";

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

      console.log("Schedule is" + schedule);

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

          // console.log(schedule[i][j]["courseName"] + ': startTime_base10 = ' + startTime_base10 + ', endTime_base10 = ' + endTime_base10 + ', frameStartY  = ' + frameStartY + ', frameEndY = ' + frameEndY + ', height = ' + height);

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
      //  x[currentHour-7].style.backgroundColor = 'lightblue';
      //  for(var i = 8; i< 24; i++)
      //  {
      //   console.log(x%2);
      //   x[i-7].cells[dayinweek].style.backgroundColor = ((i%2)==0 ) ? 'lightblue' : "lightgray";
      // }
      // x[currentHour-7].cells[dayinweek].innerHTML = "HERE";
    }
  })
});

})

.controller('CourseCtrl', function($scope, $rootScope, $state, $http) {
  $scope.remove = function(sectionid){
    console.log("removing course"+sectionid);
    $http({
      url:'http://52.10.74.192/blog/deleteclass.php',
      method:   "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {'username':$scope.user.username,'password':$scope.user.password,'sectionid':sectionid}
      })
    .success(function (data, status, headers, config) {
      console.log("Course removed successfully" + data);
      $rootScope.courses = data;
    })
    .error(function (data, status, headers, config) {
      console.log("Error occurred.  Status:" + status);
    });
  }
  $scope.$on('$ionicView.afterEnter',function(){
    console.log("Courses:"+$rootScope.courses);

  })

})
.controller('AddCourseCtrl', function($scope,$rootScope, $state, $http,AuthenticationService) {
  $scope.candidates = [];
  $scope.$watch('candidates',function(){
    console.log($scope.candidates);
  });
  $scope.search = function(keyword){
   $http({
    url:'http://52.10.74.192/blog/searchsection.php?keyword='+keyword,
    method:   "GET",
  })
   .success(function (data, status, headers, config) {
    $scope.candidates = data;
    console.log("search course successful, courses list"+$rootScope.candidates);
  })
   .error(function (data, status, headers, config) {
    console.log("Error occurred.  Status:" + status);
  });
 };
 $scope.addCourse = function(sectionid){
  console.log("Adding course #"+sectionid);
  $http({
    url:'http://52.10.74.192/blog/enrollclass.php',
    method:   "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {'username':$rootScope.user.username,'password':$rootScope.user.password,'sectionid':sectionid}
      })
  .success(function (data, status, headers, config) {
    console.log("Course added successfully")
    $rootScope.courses = data;
  })
  .error(function (data, status, headers, config) {
    console.log("Error occurred.  Status:" + status);
  });
}
$scope.$on('$ionicView.afterEnter',function(){

});



})

.controller('LogoutCtrl', function($scope, AuthenticationService) {
  AuthenticationService.logout();
})




