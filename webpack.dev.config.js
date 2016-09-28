const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
require('dotenv').config(); // eslint-disable-line

module.exports = {
  devtool: '#source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        EKTO_KEY: JSON.stringify(process.env.EKTO_KEY),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
            ['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'], // Webpack HMR
              }],
            }],
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
  node: {
    fs: 'empty',
  },
};
