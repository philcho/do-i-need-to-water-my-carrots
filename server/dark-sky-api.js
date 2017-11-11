const express = require('express');
const request = require('request');
const DARKSKY_KEY = require('../config.js').DARKSKY_KEY;

var getPrecipData = function(date, callback) {
  var options = {
    method: 'GET',
    uri: `https://api.darksky.net/forecast/${DARKSKY_KEY}/42.3601,-71.0589,255657600?exclude=currently,hourly,flags`
  };

  request(options, function(err, res, body) {
    callback(err, body);
  });
};

module.exports.getPrecipData = getPrecipData;