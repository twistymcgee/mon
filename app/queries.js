var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/mon';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllMonitors: getAllMonitors,
  getSingleMonitor: getSingleMonitor,
  createMonitor: createMonitor,
  updateMonitor: updateMonitor,
  removeMonitor: removeMonitor,
  getAllMonitorsInt: getAllMonitorsInt,
  toggleFlag: toggleFlag,
  getSingleMonitorInt: getSingleMonitorInt
};

function getAllMonitorsInt() {
  return db.any('select * from monitors')
    .then(function (data) {
      return data;
    })
    .catch(function(error) {
      console.log("Error:", error);
    });
}

function getSingleMonitorInt(monitorID) {
  return db.one('select * from monitors where id = $1', monitorID)
    .then(function (data) {
      return data;
    })
    .catch(function(error) {
      console.log("Error:", error);
    });
}

function toggleFlag(monitorID, down) {

    return db.none('update monitors set down=$1 where id=$2',
      [down, monitorID])
      .then(function () {
        return true
      })
      .catch(function (err) {
        return next(err);
      });

}

function getAllMonitors(req, res, next) {
  db.any('select * from monitors')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL monitors'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleMonitor(req, res, next) {
  var monitorID = parseInt(req.params.id);
  db.one('select * from monitors where id = $1', monitorID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE monitor'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createMonitor(req, res, next) {
  req.body.port = parseInt(req.body.port);
  req.body.timeout = parseInt(req.body.timeout);
  db.none('insert into monitors(name, host, port, find_string, timeout)' +
      'values(${name}, ${host}, ${port}, ${find_string}, ${timeout})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one monitor'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateMonitor(req, res, next) {
  db.none('update monitors set name=$1, host=$2, port=$3, find_string=$4, timeout=$5 where id=$6',
    [req.body.name, req.body.host, parseInt(req.body.port),
      req.body.find_string, parseInt(req.params.timeout), parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated monitor'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeMonitor(req, res, next) {
  var monitorID = parseInt(req.params.id);
  db.result('delete from monitors where id = $1', monitorID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} monitor`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}
