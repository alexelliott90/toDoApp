let jwt = require("jsonwebtoken");
const Login = require('../models/loginModel')

//middleware to check the JWT token to ensure user cannot access certain functions without a valid token
function checkJWTToken(req, res, next) {
    if (req.headers.token) {
        let token = req.headers.token;
        jwt.verify(token, "secretKey", function (error, data) {
            if (error) {
                res.send({ message: "Invalid Token" });
                next();
            } else {
                req.username = data.username;
                req.password = data.password;
                next();
            }
        });
    } else {
        res.send({ message: "No token attached to the request" });
    }
}

//middleware to reject the addition of tasks that exceed 140 characters
function checkTaskLength(req, res, next){
    if(req.body.title.length <= 140){
        next()
    }
    else {
        res.send({message: "Error - item above 140 character limit"})
    }

}

//middleware to check registration passwords match
function checkPasswordMatches(req, res, next){
    if(req.body.password == req.body.password2){
        next()
    }else{
        res.send({message: "Error - passwords do not match"})
    }
}

let duplicateUsername = false

//middleware to check if the user is already registered
//checks for duplicate log in username and sends error if already registered
function checkUsernameDuplicate(req, res, next){
    Login.find()
    .then((logins) => {
        for(let i=0 ; i<logins.length ; i++){
            if(logins[i].username == req.body.username){
                duplicateUsername = true
            }
        }
        if(duplicateUsername == true){
            res.send({message: "Username already registered!"})
        }else{
            next()
        }
    })
}

//middleware to only allow gmail addresses to register
//throws a 403 error if not a gmail address
function checkIsGmail(req, res, next){
    const email = req.body.username
    const emailArray = email.split("@")
    if(emailArray[1] != "gmail.com"){
        res.status(403).send({message: "Not a valid gmail"})
    }else{
        next()
    }
}

//middleware to check if the body of a request is a JSON
//used only in the 'add a new item' request, but could be added to more requests if needed
function checkIsJSON(req, res, next){
    let itemToCheck = req.body

    //if the body is JSON, then it will not throw an error.
    //if the body is not a JSON, then it will throw an error
    if(typeof(itemToCheck) == "object"){
        try{
            fileStringified = JSON.stringify(itemToCheck)
            JSON.parse(fileStringified)
            //if no error is thrown, then continue
            next()
        }catch(e) {
            res.send({message: "Not valid JSON"})
        }

    }else{res.send({message: "Not valid JSON"})}

}

//export the above modules
module.exports = {
    checkJWTToken, checkTaskLength, checkPasswordMatches, checkUsernameDuplicate,
    checkIsGmail, checkIsJSON
};