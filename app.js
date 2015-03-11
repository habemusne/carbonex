var express = require('express');

var app = express();
var courses = require(__dirname + '/www/routes/courses');
var users = require(__dirname + '/www/routes/users');

app.set('views', './www/templates');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/www/'));
//app.set('view engine', 'jade');

//Routes
app.get('/', function(req, res) {
  res.render('home.html', {
    title: 'Welcome'
  });
});

app.get('/api/getcourses', courses.getCourses);
app.post('/api/login', users.userValidate);

app.listen(process.env.PORT || 3000);