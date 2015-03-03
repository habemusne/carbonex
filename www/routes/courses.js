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
            "Time": "5:00p-6:20p",
            "BuildingRoom": "CENTR_115",
            "Instructor": "Staff"
          },
          {
            "-class": "DI",
            "Section": "A01",
            "Days": "W",
            "Time": "2:00p-2:50p",
            "BuildingRoom": "PCYNH_109"
          },
          {
            "-class": "FI",
            "Section": "06/06/2015",
            "Days": "S",
            "Time": "8:00a-10:59a",
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
            "Time": "1:00p-1:50p",
            "BuildingRoom": "LEDDN_AUD",
            "Instructor": "Zhou, Shenggao"
          },
          {
            "-class": "DI",
            "Section": "A01",
            "Days": "Th",
            "Time": "10:00a-10:50a",
            "BuildingRoom": "APM_2301"
          },
          {
            "-class": "FI",
            "Section": "06/11/2015",
            "Days": "Th",
            "Time": "11:30a-2:29p",
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


