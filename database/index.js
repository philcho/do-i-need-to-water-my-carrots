const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carrots');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('we\'re connected');
});

var dbSchema = mongoose.Schema({
  date: { type: String, index: { unique: true }},
  rainfall: Number,
  zipcode: String,
  hightemp: Number  
});

var RainLog = mongoose.model('RainLog', dbSchema);

var dataGet = function(day, callback) {
  RainLog.find({ date: day }, function(err, rainEntry) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rainEntry);
    }
  }); 
};

var dataSave = function(weatherData, day, callback) {
  let wData = JSON.parse(weatherData).daily.data[0];

  var rainEntry = new RainLog({
    date: day,
    rainfall: wData.precipAccumulation || 0,
    zipcode: '02201',
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
