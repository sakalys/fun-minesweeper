const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  entry: './src/app.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {loader: 'babel-loader'}
      }
    ]
  }
};