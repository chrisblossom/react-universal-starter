/* @flow */

/* eslint-disable strict */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = require('../config/env');

const { buildPath, publicPath, rootPath, srcPath } = config.paths;

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

        new HardSourceWebpackPlugin({
            // Either an absolute path or relative to output.path.
            cacheDirectory: path.resolve(
                rootPath,
                '.cache/hard-source/dll/[confighash]'
            ),
            // Either an absolute path or relative to output.path. Sets webpack's
            // recordsPath if not already set.
            recordsPath: path.resolve(
                rootPath,
                '.cache/hard-source/dll/[confighash]/records.json'
            ),
            // Either a string value or function that returns a string value.
            configHash: function(webpackConfig) {
                // Build a string value used by HardSource to determine which cache to
                // use if [confighash] is in cacheDirectory or if the cache should be
                // replaced if [confighash] does not appear in cacheDirectory.
                //
                // node-object-hash on npm can be used to build this.
                return require('node-object-hash')({ sort: false }).hash(
                    webpackConfig
                );
            },
            // This field determines when to throw away the whole cache if for
            // example npm modules were updated.
            environmentHash: {
                root: process.cwd(),
                directories: ['node_modules'],
                files: ['package.json'],
            },
        }),
    ],
};

module.exports = dll;
