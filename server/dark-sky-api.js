const express = require('express');
const request = require('request');
const DARKSKY_KEY = require('../config.js').DARKSKY_KEY;

var getPrecipData = function(day, callback) {
  var options = {
    method: 'GET',
    uri: `https://api.darksky.net/forecast/${DARKSKY_KEY}/42.3601,-71.0589,${day}T00:00:00-8000?exclude=currently,hourly,flags`
  };

  request(options, function(err, res, body) {
    callback(err, body);
  });
};

module.exports.getPrecipData = getPrecipData;