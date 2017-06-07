/* @flow */

/* eslint-disable strict */

'use strict';

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware-multi-compiler');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const clientConfig = require('./client');
const serverConfig = require('./server');

const publicPath = clientConfig.output.publicPath;
const outputPath = clientConfig.output.path;
const multiCompiler = webpack([clientConfig, serverConfig]);

multiCompiler.apply(
    new FriendlyErrorsWebpackPlugin({
        clearConsole: false,
    })
);

const clientCompiler = multiCompiler.compilers.find(compiler => {
    return compiler.name === 'client';
});

const router = express.Router();

router.use(
    webpackDevMiddleware(multiCompiler, {
        quiet: true,
        publicPath,
    })
);

router.use(
    webpackHotMiddleware(clientCompiler, {
        log: () => {},
    })
);

router.use(
    webpackHotServerMiddleware(multiCompiler, {
        serverRendererOptions: { outputPath },
    })
);

module.exports = router;
