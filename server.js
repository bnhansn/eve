/* eslint-disable no-console, global-require, import/no-extraneous-dependencies */
require('babel-core/register');

const path = require('path');
const express = require('express');
const webpack = require('webpack');

const port = process.env.PORT || 3000;
const server = express();

process.on('unhandledRejection', (reason, p) => {
  if (reason.stack) {
    console.error(reason.stack);
  } else {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  }
});

server.get('/favicon.ico', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/x-icon' });
  res.end();
});

server.use(express.static(path.resolve(__dirname, 'build')));

if (process.env.NODE_ENV !== 'production') {
  const dev = require('webpack-dev-middleware');
  const hot = require('webpack-hot-middleware');
  const config = require('./webpack.dev.config');

  const compiler = webpack(config);

  server.use(dev(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  }));
  server.use(hot(compiler));
}

server.get('*', require('./src').serverMiddleware);

server.listen(port, (error) => {
  if (error) console.error(error);
  console.info(`🌎  Server running on http://localhost:${port}/`);
});
