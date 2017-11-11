const bodyParser = require('body-parser');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const app = express();
const Promise = require('bluebird');
const getPrecipDataAsync = Promise.promisify(require('./dark-sky-api').getPrecipData);
 
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
  console.log('in app.get');
  getPrecipDataAsync(null)
    .then(function(data) {
      res.status(200).send(data);
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