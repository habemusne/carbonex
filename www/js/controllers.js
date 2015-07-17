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

.controller('LoginCtrl', function($scope, $rootScope, $http, $state, AuthenticationService,$ionicPopup) {
  $scope.message = "";
  $scope.signup = function() {
    $http({
      url:'http://52.10.74.192/blog/signup.php',
      method:   "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {'username':$rootScope.user.username,
        'email':$rootScope.user.email,
        'password':$rootScope.user.password,
        'confirm':$rootScope.user.confirm,
        'submit':'yes'}
      })
    .success(function (data, status, headers, config) {
      console.log("Login Success: data " + data + "status: " + status);
      var addSuccess = $ionicPopup.alert({
       title: 'Signup Successful',
       template: 'Your courses are now organized!'
     });
      $rootScope.courses = data;
      $rootScope.authorized = true;
    })
    .error(function (data, status, headers, config) {
      console.log("Login Failed with data " + data + ", status " + status + " headers " + headers);
      var addSuccess = $ionicPopup.alert({
       title: 'Signup Failed',
       template: 'status: '+ status + ' data: ' + headers 
     });
      $rootScope.$broadcast('event:auth-login-failed', status);
    });
  }


  $scope.login = function() {
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

   }
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

   colorarray = [['#91ccd9', '#049dbf'],
   ['#7cbe8e', '#50a578'],
   ['#9aa2c6', '#646fa1'],
   ['#f8a391', '#f26c62'],
   ['#2fbeee', '#8ce2ff'],
   ['#ffc0cb', '#ff77aa'],
   ['#9cf9b5', '#81ea9d']];

   color_idx = 0;
   base_height = 56.0;
   base_length = 66.0;
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
    } 
    else if (parseInt(meetingA["time"].substring(0, 2))
      > parseInt(meetingB["time"].substring(0, 2))) {
      return 1;
  } 
  else {
    if (parseInt(meetingA["time"].substring(3, 5))
      < parseInt(meetingB["time"].substring(3, 5))) {
      return -1;
  } 
  else if (parseInt(meetingA["time"].substring(3, 5))
    > parseInt(meetingB["time"].substring(3, 5))) {
    return 1;
}
return 0;
}
});
  }

      // (check for all kinds of conflict)
      if (schedule[0] == null) {}
        else{
        // Checking conflict, if conflict, change its tag.
        for (i = 0; i < schedule.length; ++i) {
          // count for checking how many courses conflict
          count = 1;

          if (schedule[i].length <= 1) {
            continue;
          }

          for (j = 0; j < schedule[i].length - 1; j++) {
            if (parseInt(schedule[i][j]["time"].substring(0, 2)) == 
              parseInt(schedule[i][j + 1]["time"].substring(0, 2))) {
              //console.log("check 1");
            ++count;
            schedule[i][j]['overlap'] = 'y';
            schedule[i][j + 1]['overlap'] = 'y';
          }

            // 1st end hour larger than 2nd start hour
            else if (parseInt(schedule[i][j]["time"].substring(6, 8)) >=
              parseInt(schedule[i][j + 1]["time"].substring(0, 2))) {
              if (parseInt(schedule[i][j]["time"].substring(9, 11)) >=
                parseInt(schedule[i][j + 1]["time"].substring(3, 5))) {
                //console.log("check 2");
              ++count;
              schedule[i][j]['overlap'] = 'y';
              schedule[i][j + 1]['overlap'] = 'y';
            }
          }
          else {
            schedule[i][j + 1]['overlap'] = '';
          }
        }

          // check count
          pos = 0;
          for (j = 0; j < schedule[i].length; j++) {
            if (schedule[i][j]['overlap'] == 'y') {
              schedule[i][j]['count'] = count;
              schedule[i][j]['pos'] = pos;
              pos++;
            }
          }
        }
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


      for (i = 0; i < DayElements.length; ++i){
        for (j = 0; j < schedule[i].length; ++j){
          time = schedule[i][j]["time"];
          startTime_base10 = parseFloat(time.substring(0, 2))
          + parseFloat(time.substring(3, 5)) / 60.0;
          diff = startTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameStartY = base_height * (diff + 1);

          endTime_base10 = parseFloat(time.substring(6, 8))
          + parseFloat(time.substring(9, 11)) / 60.0;
          diff = endTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameEndY = base_height * (diff + 1);

          height = frameEndY - frameStartY;


          div = document.createElement('DIV');
          div.style.minHeight = height.toString() + 'px';
          div.style.maxHeight = height.toString() + 'px';
          div.style.marginTop = frameStartY.toString() + 'px';
          div.style.position = 'absolute';
          div.style.opacity = 0.8;
          div.course = schedule[i][j];
          div.addEventListener('click',clickHandler,false);

/********************** on click ********************/
          function clickHandler(e){
            var csName = e.target.course;
            var addSuccess = $ionicPopup.alert({
            title:'Course Info',
            template: 'Name: '+ csName["courseName"] 
                + ' Place: ' + csName["room"],
            okText:'Gotcha!'
           });
         } 
/********************** on click done ******************/


         if (schedule[i][j]['overlap'] == 'y') {
          var width = 11 / schedule[i][j]['count'];
          div.style.width = width + '%';
          var marginL = schedule[i][j]['pos'] * width;
          div.style.marginLeft = marginL + '%';
        }

          courseNumberNode = document.createElement('h6');

          courseNumberText =
          document.createTextNode(schedule[i][j]["courseName"]);

          MeetingType = schedule[i][j]["type"];
          if (MeetingType == 'LE'){

            div.className = "lecture-node";
            div.style.backgroundColor = schedule[i][j]['color'][0];
          } else if (MeetingType == 'DI'){
            div.className = "discussion-node";
            div.style.backgroundColor = schedule[i][j]['color'][1];
          }
          courseNumberNode.className = "course-num-text";


          courseNumberNode.appendChild(courseNumberText);

          div.appendChild(courseNumberNode);

          DayElements[i].appendChild(div);


        }
      }


      $rootScope.$broadcast('event:auth-loginConfirmed', data);
    })
.error(function (data, status, headers, config) {
  console.log("Login Failed with data " + data + ", status " + status + " headers " + headers);
  var addSuccess = $ionicPopup.alert({
   title: 'Login Failed',
   template: 'status: '+ status + ' data: ' + headers 

 });
  $rootScope.$broadcast('event:auth-login-failed', status);
});
};

$scope.$on('event:auth-loginRequired', function(e, rejection) {
  $scope.loginModal.show();
});

$scope.$on('event:auth-loginConfirmed', function() {
    //Commenting out because we want to buffer rootScope username and password
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
     day2ScheduleIndex = [];
     day2ScheduleIndex['M'] = 0;
     day2ScheduleIndex['Tu'] = 1;
     day2ScheduleIndex['W'] = 2;
     day2ScheduleIndex['Th'] = 3;
     day2ScheduleIndex['F'] = 4;
     day2ScheduleIndex['Sa'] = 5;
     day2ScheduleIndex['Su'] = 6;

     colorarray = [['#91ccd9', '#049dbf'],
      ['#7cbe8e', '#50a578'],
      ['#9aa2c6', '#646fa1'],
      ['#f8a391', '#f26c62'],
      ['#2fbeee', '#8ce2ff'],
      ['#ffc0cb', '#ff77aa'],
      ['#9cf9b5', '#81ea9d']];

     color_idx = 0;
     base_height = 56.0;
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
      } 
      else if (parseInt(meetingA["time"].substring(0, 2))
        > parseInt(meetingB["time"].substring(0, 2))) {
        return 1;
    } 
    else {
      return 0;
    }
  });
    }

      // (check for all kinds of conflict)
      if (schedule[0][0] == null) {}
        else{
        // count for checking how many courses conflict
        count = 0;

        // Checking conflict, if conflict, change its tag.
        for (i = 0; i < schedule.length; ++i) {
          if (schedule[i].length <= 1) {
            continue;
          }

          for (j = 0; j < schedule[i].length - 1; j++) {
            if (parseInt(schedule[i][j]["time"].substring(0, 2)) == 
              parseInt(schedule[i][j + 1]["time"].substring(0, 2))) {
              ++count;
            schedule[i][j]['overlap'] = 'y';
            schedule[i][j + 1]['overlap'] = 'y';
          }

            // 1st end hour larger than 2nd start hour
            else if (parseInt(schedule[i][j]["time"].substring(6, 8)) >=
              parseInt(schedule[i][j + 1]["time"].substring(0, 2))) {
              if (parseInt(schedule[i][j]["time"].substring(9, 11)) >=
                parseInt(schedule[i][j + 1]["time"].substring(3, 5))) {
                ++count;
              schedule[i][j]['overlap'] = 'y';
              schedule[i][j + 1]['overlap'] = 'y';
            }
          }
          else {
            schedule[i][j + 1]['overlap'] = '';
          }
        }

          // check count
          pos = 0;
          for (j = 0; j < schedule[i].length; j++) {
            if (schedule[i][j]['overlap'] == 'y') {
              schedule[i][j]['count'] = count;
              schedule[i][j]['pos'] = pos;
              pos++;
            }
          }
        }
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


      for (i = 0; i < DayElements.length; ++i){
        for (j = 0; j < schedule[i].length; ++j){
          time = schedule[i][j]["time"];
          startTime_base10 = parseFloat(time.substring(0, 2))
          + parseFloat(time.substring(3, 5)) / 60.0;
          diff = startTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameStartY = base_height * (diff + 1);

          endTime_base10 = parseFloat(time.substring(6, 8))
          + parseFloat(time.substring(9, 11)) / 60.0;
          diff = endTime_base10 - SCHEDULE_DAY_START_HOUR;
          frameEndY = base_height * (diff + 1);

          height = frameEndY - frameStartY;

          // console.log(schedule[i][j]["courseName"] + ': startTime_base10 = ' + startTime_base10 + ', endTime_base10 = ' + endTime_base10 + ', frameStartY  = ' + frameStartY + ', frameEndY = ' + frameEndY + ', height = ' + height);

          div = document.createElement('DIV');
          div.style.minHeight = height.toString() + 'px';
          div.style.maxHeight = height.toString() + 'px';
          div.style.marginTop = frameStartY.toString() + 'px';
          div.style.position = 'absolute';
          div.style.opacity = 0.8;
          div.addEventListener("click",clickHandler,false);

/********************** on click ********************/
          function clickHandler(e){
            var csName = e.target.course;

            var addSuccess = $ionicPopup.alert({
              title:'Course Info',
              template: 'Name: '+ csName["courseName"] 
                  + ' Place: ' + csName["room"],
              okText:'Gotcha!'
            });
         } 
/********************** on click done ******************/ 

         if (schedule[i][j]['overlap'] == 'y') {
          var width = 11 / schedule[i][j]['count'];
          div.style.width = width + '%';
          var marginL = schedule[i][j]['pos'] * width;
          div.style.marginleft = marginL + '%';
        }

          courseNumberNode = document.createElement('h6');

          courseNumberText =
          document.createTextNode(schedule[i][j]["courseName"]);

          MeetingType = schedule[i][j]["type"];
          if (MeetingType == 'LE'){

            div.className = "lecture-node";
            div.style.backgroundColor = schedule[i][j]['color'][0];
          } else if (MeetingType == 'DI'){
            div.className = "discussion-node";
            div.style.backgroundColor = schedule[i][j]['color'][1];
          }
          courseNumberNode.className = "course-num-text";

          courseNumberNode.appendChild(courseNumberText);

          div.appendChild(courseNumberNode);

          DayElements[i].appendChild(div);

        }
      }



    })
});

})

.controller('CourseCtrl', function($scope, $rootScope, $state, $http, $ionicPopup) {
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
    console.log("Course added successfully");
    var addSuccess = $ionicPopup.alert({
     title: 'Courses added successfully',
     template: ''
   });
    $rootScope.courses = data;
  })
  .error(function (data, status, headers, config) {
    console.log("Error occurred.  Status:" + status);
    var addSuccess = $ionicPopup.alert({
     title: 'Courses failed to add',
     template: status
   });
  });
}
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
    var addSuccess = $ionicPopup.alert({
     title: 'Courses removed successfully',
     template: ''
   });
    $rootScope.courses = data;
  })
  .error(function (data, status, headers, config) {
    console.log("Error occurred.  Status:" + status);
    var addSuccess = $ionicPopup.alert({
     title: 'Courses failed to remove',
     template: status
   });
  });
}
$scope.$on('$ionicView.afterEnter',function(){
  console.log("Courses:"+$rootScope.courses);

})

})

.controller('LogoutCtrl', function($scope, AuthenticationService) {
  AuthenticationService.logout();
})

.controller('PlaygroundCtrl', function($scope) {
//Do nothing
})


