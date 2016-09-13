var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');

var routes = require('./routes/index');
var users = require('./routes/users');

var shdlr = require('./scheduler/scheduler');
var queries = require('./queries');

var app = express();

winston.add(
  winston.transports.File, {
    filename: 'mon-app.log',
    level: 'info',
    json: true,
    eol: '\n',
    timestamp: true
  }
)

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

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', routes);
app.use('/users', users);

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
    res.status(err.status || 500)
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

app.listen(3001, function () {
  winston.info("App started, gathering monitors");
  queries.getAllMonitorsInt()
    .then(function (allMonitors) {
      for (var i = 0; i < allMonitors.length; i++) {
        winston.info("Scheduling monitor: " + allMonitors[i].name);
        shdlr.scheduleJob(allMonitors[i]);
      }
    });

});


module.exports = app;
