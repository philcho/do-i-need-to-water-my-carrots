const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carrots');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('we\'re connected');
});

var dbSchema = mongoose.Schema({
  date: { type: Date, index: { unique: true }},
  rainfall: Number,
  zipcode: String,
  hightemp: Number  
});

var RainLog = mongoose.model('RainLog', dbSchema);

var dataSave = function(weatherData, callback) {
  let wData = JSON.parse(weatherData).daily.data[0];

  var rainEntry = new RainLog({
    date: wData.time,
    rainfall: wData.precipAccumulation,
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

module.exports.dataSave = dataSave;