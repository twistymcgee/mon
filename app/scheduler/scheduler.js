var schedule = require('node-schedule');
var monitor = require('../monitor/monitor')

var scheduler = {
  scheduleJob: function(mon) {
    var job = schedule.scheduleJob('* * * * *', function(){
      monitor.check(mon);
    });
    return job;
  }
}

module.exports = scheduler;
