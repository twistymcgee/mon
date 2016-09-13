var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/api/monitors', db.getAllMonitors);
router.get('/api/monitors/:id', db.getSingleMonitor);
router.post('/api/monitors', db.createMonitor);
router.put('/api/monitors/:id', db.updateMonitor);
router.delete('/api/monitors/:id', db.removeMonitor);

module.exports = router;
