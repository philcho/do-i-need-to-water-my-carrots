const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const getPrecipDataAsync = Promise.promisify(require('./dark-sky-api').getPrecipData);
const entries = require('../database');
const app = express();

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const compiler = webpack(webpackConfig);
 
app.use(express.static(__dirname + '/../dist'));

app.use(bodyParser.json());
 
app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

app.get('/data/:day', function(req, res) {
  let day = req.params.day;
  let isInDb = false;

  // Check if day's data is in DB
  entries.dataGet(day, function(err, rainEntry) {
    if (err) {
      res.status(503).send(err);   
    } else if (rainEntry.length > 0) { 
      // If yes, return entry
      res.status(200).send(rainEntry);     
    } else {
      // If not...
      // Save day's data from API and save to DB
      getPrecipDataAsync(day)
        .then(function(data) {
          entries.dataSave(data, day, function(err, rainEntry) {
            if(err) {
              if(err.code === 11000) { // duplicate entry
                res.status(409).send(err);     
              } else {
                throw new Error (err);
              }
            } else {
              res.status(200).send(rainEntry);     
            }
          });
        })
        .catch(function(err) {
          res.status(404).send(err);
        });
    }
  });
});
 
const server = app.listen(3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});