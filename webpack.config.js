var webpack = require('webpack');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build'
  }
};