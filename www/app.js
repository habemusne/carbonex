var express = require('express');

var app = express();
var courses = require('./routes/courses')

app.set('views', './templates');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));
//app.set('view engine', 'jade');

//Routes
app.get('/', function(req, res) {
  res.render('home.html', {
    title: 'Welcome'
  });
});

app.get('/api/getcourses', courses.getCourses);

app.listen(process.env.PORT || 3000);