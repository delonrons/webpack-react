// eslint-disable-next-line
'use strict';

const chalk = require('chalk');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const buildConst = require('./build.const.js');

const { log } = console;

module.exports = merge(common, {
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    path.resolve(__dirname, '../src/index.js'),
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, `../${buildConst.publicDirectory}`),
    watchContentBase: true,
    hot: true,
    port: buildConst.port,
    host: '0.0.0.0',
    open: false,
    noInfo: true,
    useLocalIp: true,
    stats: 'errors-only',
    proxy: {
      '/userlogin.html': 'http://localhost/minside',
    },
    before(app, server) {
      log(chalk.blue('\r\nAttempting to start the server.. '));
      app.use(evalSourceMapMiddleware(server));
      app.use(errorOverlayMiddleware());
    },
    after: () => {
      log(chalk.yellow('\r\nServer started..  '));
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(path.resolve(__dirname, `../${buildConst.nodeModules}`)),
    {
      apply: (compiler) => {
        compiler.hooks.afterResolvers.tap('BeforeRunPlugin', () => {
          log(chalk.cyan('\r\nPreparing your package..'));
        });

        compiler.hooks.done.tap('AfterCompilePlugin', () => {
          log(chalk.inverse('\r\nYour package is prepared.. you can view on '), chalk.bold.underline(`http://localhost:${buildConst.port}\r\n`));
        });

        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
          log(chalk.green('\r\nAssests prepared to output dir.'));
        });


        compiler.hooks.failed.tap('FailedPlugin', () => {
          log(chalk.red.bold('\r\nYour package preperation failed.'));
        });
      },
    },
  ],
  output: {
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath)
      .replace(/\\/g, '/'),
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: {
    hints: false,
  },
});
