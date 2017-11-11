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

app.get('/data', function(req, res) {
  getPrecipDataAsync(null)
    .then(function(data) {
      entries.dataSave(data, function(err, rainEntry) {
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
});
 
const server = app.listen(3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});