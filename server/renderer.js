/* @flow */

import path from 'path';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const rootPath = process.cwd();
const publicPath = path.resolve(__dirname, '../public');

function getHash(filePath) {
    const fileBody = readFileSync(filePath);
    return createHash('sha1').update(fileBody).digest('hex');
}

function Renderer() {
    const serverEntryFile = path.resolve(rootPath, 'build/server-frontend.js');
    const webpackStatsFile = path.resolve(rootPath, 'build/webpack-stats.json');

    let Html = require(serverEntryFile).default;
    let webpackStats = require(webpackStatsFile);
    let previousWebpackStatsFileHash;
    let previousServerEntryFileHash;

    return function render() {
        if (__PRODUCTION_RELEASE__ === false) {
            const webpackStatsFileHash = getHash(webpackStatsFile);
            const serverEntryFileHash = getHash(serverEntryFile);

            if (
                webpackStatsFileHash !== previousWebpackStatsFileHash &&
                serverEntryFileHash !== previousServerEntryFileHash
            ) {
                previousWebpackStatsFileHash = webpackStatsFileHash;
                previousServerEntryFileHash = serverEntryFileHash;

                delete require.cache[require.resolve(serverEntryFile)];
                delete require.cache[require.resolve(webpackStatsFile)];

                Html = require(serverEntryFile).default;
                webpackStats = require(webpackStatsFile);
            }
        }

        return renderToStaticMarkup(
            <Html clientStats={webpackStats} outputPath={publicPath} />,
        );
    };
}

export default Renderer;
