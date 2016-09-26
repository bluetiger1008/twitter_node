var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var TwitterPackage = require('twitter');

var routes = require('./routes/index');
var users = require('./routes/users');

var secret = {
  consumer_key: 'LDWy2oD6lP8T7eRKwXjwMdVDa',
  consumer_secret: '276XBqhSQmyDRq2VdjmfeiqnhVVaTG6MQHeGOFlEHpiaafcK6X',
  access_token_key: '2905163500-hyp3tPKh6rkDa7wPoR78v9I6bUA6Cwtu0h2BEQI',
  access_token_secret: 'Zl1RkLy8FNA7ZU4qFrmtghMsFWauL0KaySahkg7e57WPd'
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/', function(req, res){
  var userName = req.body.firstname;
  var company = req.body.company;
  var message = req.body.message;

  var Twitter = new TwitterPackage(secret);

  var str = userName + ' says, ' + '"' + message + '" ' + company + ' #ThankYouForHelping';

  Twitter.post('statuses/update', {status: str},  function(error, tweet, response){
    if(error){
      console.log(error);
      res.send(error);
    }
    console.log(tweet);  // Tweet body.
    console.log(response);  // Raw response object.
    res.render('success');
  });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
