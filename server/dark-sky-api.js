const express = require('express');
const request = require('request');
const DARKSKY_KEY = require('../config.js').DARKSKY_KEY;

// Lat/longs
  // Hack Reactor: 37.7836924,-122.4111606
  // Portland International Airport: 45.5897694,-122.5972882
  // Mariahilfplatz in Munich: 48.120226,11.5613233

var getPrecipData = function(day, callback) {
  var options = {
    method: 'GET',
    uri: `https://api.darksky.net/forecast/${DARKSKY_KEY}/37.7836924,-122.4111606,${day}T00:00:00-8000?exclude=currently,hourly,flags`
  };

  request(options, function(err, res, body) {
    callback(err, body);
  });
};

module.exports.getPrecipData = getPrecipData;