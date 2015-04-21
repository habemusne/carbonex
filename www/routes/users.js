var userData = 
{
  "users": [
    {
      "-ID": "1",
      "username": "yefeiwang2009",
      "password": "woshizhu",
    },
    {
      "-ID": "2",
      "username": "nanchen520",
      "password": "geiwogun",
    }
  ]
}

exports.userValidate = function (req, res){

  username = req.body.username;
  password = req.body.password;


  for (i = 0; i < userData["users"].length; ++i){
    block = userData["users"][i]
    if (username == block["username"]){
      if (password == block["password"]){
        res.writeHead(200);
        res.end("Login Success");
      } else {
        res.writeHead(300);
        res.end("Wrong Password");
      }
    }
  }

  res.writeHead(400);
  res.end("User does not exist");

}

