var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let PORT = 8080 || process.env.PORT
const mongoose = require("mongoose");
const fs = require('fs')
var app = express();

//set up cors
const cors = require("cors")
app.use(cors())

//set up to Parse JSON data
app.use(express.json());

//set up helmet
const helmet = require("helmet");
app.use(helmet());

//bodyparser to allow json objects to be passed to the server
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

let { checkJWTToken } = require("./routes/middleware");

const buildPath = path.join(__dirname, 'frontend/build')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//adding checkJWT token here ensures that each endpoint applicable to the user's route must have a valid jwt-token to proceed with any data manipulation in the database.
app.use('/users', usersRouter);

app.use(express.static(buildPath))

// gets the static files from the build folder
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

//connnect to mongo cars database
mongoose.connect('mongodb+srv://alexelliott90:A35A0mTUegZMMWOZ@todoapp.zwexra2.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to database!');
})
.catch((error) => {
  console.log('Error - could not connect to database:', error.message);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log("Application up and running on port: " + PORT)
})

module.exports = app;
