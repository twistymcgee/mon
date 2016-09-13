var nodemailer = require('nodemailer');
var config = require('../config.json');
var winston = require('winston');

var mailer = {

  notify: function(mon, up) {
    winston.info("Sending notification");
    var status = up ? "up!" : "down!";
    var transporter = nodemailer.createTransport({
      host: config.mailer.smtp_host
    });

    var mailOptions = {
      from: config.mailer.from_address,
      to: config.mailer.to_address,
      subject: mon.name + " is " + status,
      text: mon.name + " is " + status
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        winston.error(error);
      } else {
        winston.info('Notification sent');
      }
    });
  }

};

module.exports = mailer;
