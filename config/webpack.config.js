// eslint-disable-next-line
'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const getClientEnvironment = require('./env');
const buildConst = require('./build.const.js');

const env = getClientEnvironment('');


module.exports = {

  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot-loader/webpack', 'babel-loader?presets[]=@babel/preset-env,presets[]=@babel/preset-react'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(
      [path.resolve(__dirname, `../${buildConst.buildDirectory}`)],
      {
        root: path.resolve(__dirname, '../'),
      },
    ),
    new HtmlWebpackPlugin({
      title: buildConst.title,
      hash: true,
      inject: true,
      template: path.resolve(__dirname, `../${buildConst.publicDirectory}/index.html`),
    }),
    new InterpolateHtmlPlugin(env.raw),
  ],
  output: {
    filename: 'static/js/bundle.js',
    path: path.resolve(__dirname, `../${buildConst.buildDirectory}`),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
