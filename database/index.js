const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carrots');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('we\'re connected');
});

var dbSchema = mongoose.Schema({
  date: String,
  rainfall: Number,
  latLong: String,
  hightemp: Number  
});

var RainLog = mongoose.model('RainLog', dbSchema);

var dataGet = function(day, latLong, callback) {
  RainLog.find({ date: day, latLong: latLong }, function(err, rainEntry) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rainEntry);
    }
  }); 
};

var dataSave = function(weatherData, day, latLong, callback) {
  let wData = JSON.parse(weatherData).daily.data[0];

  var rainEntry = new RainLog({
    date: day,
    rainfall: wData.precipAccumulation || 0,
    latLong: latLong,
    hightemp: wData.temperatureHigh
  });

  rainEntry.save(function(err, rainEntry) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rainEntry);
    }
  });
};

module.exports.dataGet = dataGet;
module.exports.dataSave = dataSave;
