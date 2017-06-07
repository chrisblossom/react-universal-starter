/* @flow */

/* eslint-disable import/no-dynamic-require */

import 'babel-polyfill';

import path from 'path';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const rootPath = process.cwd();
const publicPath = path.resolve(__dirname, '../public');

app.set('etag', false);
app.use('/dist/', express.static(publicPath));

if (__HMR__) {
    const webpackRoutes = require(path.resolve(
        rootPath,
        'tools/webpack/hmr_middleware',
    ));
    app.use(webpackRoutes);
} else {
    const rendererPath = path.resolve(rootPath, 'build/server-frontend.js');
    const webpackStatsPath = path.resolve(rootPath, 'build/webpack-stats.json');

    const renderReact = require(rendererPath).default;
    const webpackStats = require(webpackStatsPath);

    app.use(
        renderReact({
            clientStats: webpackStats,
            outputPath: publicPath,
        }),
    );
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

server.listen(port, error => {
    if (error) {
        console.error('express start error', error);

        return;
    }

    console.log('express server started on port', port);
});
