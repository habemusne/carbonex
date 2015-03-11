var coursesData = 
{
  "CourseList": {
    "course": [
      {
        "-ID": "1",
        "courseNumber": "CSE_101",
        "description": "Design and Analysis of Algorithm (4 Units)",
        "SectionID": "839503",
        "MeetingType": [
          {
            "-class": "LE",
            "Section": "A00",
            "Days": "MW",
            "Time": "17:00-18:20",
            "BuildingRoom": "CENTR_115",
            "Instructor": "Staff"
          },
          {
            "-class": "DI",
            "Section": "A01",
            "Days": "W",
            "Time": "14:00-14:50",
            "BuildingRoom": "PCYNH_109"
          },
          {
            "-class": "FI",
            "Section": "06/06/2015",
            "Days": "S",
            "Time": "8:00-10:59",
            "BuildingRoom": "TBA_TBA"
          }
        ]
      },
      {
        "-ID": "2",
        "courseNumber": "MATH_10A",
        "description": "Calculus I (4 Units)",
        "SectionID": "838189",
        "MeetingType": [
          {
            "-class": "LE",
            "Section": "A00",
            "Days": "MWF",
            "Time": "13:00-13:50",
            "BuildingRoom": "LEDDN_AUD",
            "Instructor": "Zhou, Shenggao"
          },
          {
            "-class": "DI",
            "Section": "A01",
            "Days": "Th",
            "Time": "10:00-10:50",
            "BuildingRoom": "APM_2301"
          },
          {
            "-class": "FI",
            "Section": "06/11/2015",
            "Days": "Th",
            "Time": "11:30-14:29",
            "BuildingRoom": "TBA_TBA"
          }
        ]
      }
    ]
  }
}

exports.getCourses = function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(coursesData));
}


