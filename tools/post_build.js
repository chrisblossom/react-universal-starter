/* @flow */

const { readdirSync, readFileSync, statSync } = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');
const run = require('./run');
const clean = require('./clean');
const log = require('./utils/log');
const config = require('./config/env');

const { buildPath, publicPath } = config.paths;

async function postBuild() {
    await run(clean, {
        del: [
            path.resolve(buildPath, '*.*'),
            `!${path.resolve(buildPath, '*.js*')}`,
        ],
    });

    /**
     * Print file size stats.
     * TODO: images including inline, maybe groupBy webpack entry
     */
    log.info('--');
    log.info('Client Assets:');

    const webpackAssets = readdirSync(publicPath);

    webpackAssets.forEach(asset => {
        const file = path.resolve(publicPath, asset);

        const extension = path.extname(file);
        if (['.css', '.js'].includes(extension)) {
            const fileName = path.basename(file);
            const filePath = path.resolve(publicPath, fileName);
            const fileSize = statSync(filePath).size;
            const compressed = gzipSize.sync(readFileSync(filePath));
            log.info(
                `  ${asset} ${prettyBytes(fileSize)} (~${prettyBytes(
                    compressed
                )} gzipped)`
            );
        }
    });

    log.info('--');
}

module.exports = postBuild;
