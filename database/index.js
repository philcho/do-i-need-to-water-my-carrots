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
  zipcode: Number,
  hightemp: Number  
});

var RainLog = mongoose.model('RainLog', dbSchema);

var dataSave = function(weatherData, callback) {
  var rainEntry = new RainLog({
    date: 255657600,
    rainfall: 7.337,
    zipcode: 02201,
    hightemp: 31.84
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