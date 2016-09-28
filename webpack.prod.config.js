// strict mode required for heroku deploy
'use strict'; // eslint-disable-line

const path = require('path');
const webpack = require('webpack');
const del = require('del');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

class CleanPlugin {
  constructor(options) {
    this.options = options;
  }

  apply() {
    del.sync(this.options.files);
  }
}

module.exports = {
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: 'bundle.js',
    publicPath: '/static',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CleanPlugin({
      files: ['build/*'],
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        EKTO_KEY: JSON.stringify(process.env.EKTO_KEY),
      },
    }),
    new ExtractTextPlugin('styles.css', { allChunks: true }),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
          plugins: [
            ['transform-object-assign'],
          ],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          'css-loader',
          'postcss-loader',
        ]),
      },
    ],
  },
  postcss: function process() {
    return [autoprefixer];
  },
  resolve: {
    extensions: ['', '.js', '.css'],
  },
};
