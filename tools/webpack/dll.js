/* @flow */

/* eslint-disable strict */

'use strict';

const path = require('path');
const webpack = require('webpack');

const config = require('../config/env');

const { buildPath, publicPath, srcPath } = config.paths;

const dll = {
    context: srcPath,
    devtool: 'source-map',
    target: 'web',

    entry: {
        vendor: [
            'react-safe-universal-inputs',
            'prop-types',
            'axios',
            'babel-polyfill',
            'credit-card-type',
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'redux',
            'redux-thunk',
            'redux-devtools',
            'redux-devtools-dock-monitor',
            'redux-devtools-log-monitor',
        ],
    },

    output: {
        path: publicPath,
        filename: '[name].dll.js',
        library: '[name]',
    },

    resolve: {
        modules: [publicPath, 'node_modules'],
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(buildPath, '[name]-manifest.dll.json'),
            name: '[name]',
        }),
    ],
};

module.exports = dll;
