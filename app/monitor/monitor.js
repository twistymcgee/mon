var request = require('request');
var queries = require('../queries');
var mailer = require('../mailer/mailer');
var winston = require('winston');

var monitor = {

  check: function(mon) {
    winston.info('Checking ' + mon.name);
    request(mon.url, function(error, response, body) {
      var up = monitor.isUp(body, mon.find_string);
      if (up) {
        winston.info(mon.name + " is up!");
      } else {
        winston.info(mon.name + " is DOWN!!");
      }
      monitor.statusChange(mon, up);
    });
  },

  isUp(body, find_string) {
    if (body === undefined) {
      return false;
    }
    var location = body.indexOf(find_string);
    if (location > -1) {
      return true;
    }
    return false;
  },

  statusChange(mon, up) {
    queries.getSingleMonitorInt(mon.id)
      .then(function (previousMon) {
        if (up && previousMon.down) {
          // currently up and was down
          winston.info("Changing status from down to up");
          queries.toggleFlag(mon.id, false);
          mailer.notify(mon, up);

        } else if (!up && !previousMon.down) {
          // currently down and was not down
          winston.info("Changing status from up to down");
          queries.toggleFlag(mon.id, true);
          mailer.notify(mon, up);
        }
      })
      .catch(function (err) {
        winston.error(err);
      });
  }

};

module.exports = monitor;
