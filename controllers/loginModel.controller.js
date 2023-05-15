const Login = require('../models/loginModel')
let jwt = require("jsonwebtoken");

//function to get all log in items
exports.getLogins = (req, res) => {
    Login.find()
      .then((logins) => {
        res.json(logins);
      })
      .catch((err) => {
        res.status(500).json({ message: "Error - log in details not retrieved" });
      });
  };

let usernameCorrect = false
let passwordCorrect = false

//function to check the log in and if correct, get a token
//will also send a message if the user has input incorrect username / password / both
exports.checkLogin = (req, res) => {
    Login.find()
    .then((logins) => {
        for(let i=0 ; i<logins.length ; i++){
            if(logins[i].username == req.body.username && logins[i].password == req.body.password){
                usernameCorrect = true
                passwordCorrect = true
            }else if (logins[i].username == req.body.username){
                usernameCorrect = true
            }else if (logins[i].password == req.body.password){
                passwordCorrect = true
            }else{}
        }

        if(usernameCorrect === true && passwordCorrect === true){
            let jwtToken = jwt.sign(
                {
                  username: req.body.username,
                  password: req.body.password,
                },
                  "secretKey",
                { expiresIn: "1h" }
            )
                res.status(200).send(jwtToken)
        }else if(usernameCorrect === true){
            res.status(403).send('error - Incorrect password!')
        }else if(passwordCorrect === true){
            res.status(403).send('error - Incorrect username!')
        }else{res.status(403).send('error - Incorrect log in details!')}
        
        usernameCorrect = false
        passwordCorrect = false
      })
    .catch((err) => {
        //res.status(500).send({'err':'user information incorrect!'});
    });
}

// Function to POST a new log in for user registration
exports.createLogin = (req, res) => {
    // Create a new to do item
  const newLogin = new Login({
    username: req.body.username,
    password: req.body.password,
  });
  // Save new login to the database
  newLogin.save()
    .then((addNewLogin) => {
      //200 status to show car successfully added
      res.status(200).json(addNewLogin);
    })
    .catch((err) => {
      //400 status in case of error
      res.status(400).send({ message: "Error - login could not be added" });
    });
  };