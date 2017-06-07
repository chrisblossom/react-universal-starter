/* @flow */

const browserSync = require('browser-sync');
const log = require('./utils/log');
const run = require('./run');
const clean = require('./clean');
const copy = require('./copy');
const bundleDll = require('./bundle_dll');
const RedisServer = require('redis-server');
const watchServer = require('./watch_server');
const watchFrontend = require('./watch_frontend');

const config = require('./config/env');

const { __HMR__ } = config.globals;

/**
 * Setup development environment
 */
const browserSyncPort = parseInt(process.env.PORT, 10) || 3000;

const nodeServerPort = __HMR__ === true ? browserSyncPort + 2 : browserSyncPort;

process.env.HOST = process.env.HOST || 'http://localhost';
process.env.PORT = nodeServerPort.toString();

const host = process.env.HOST || 'http://localhost';
const browserSyncOptions = {
    online: false,
    open: false,
    notify: false,
    xip: false,
    tunnel: false,
    ghostMode: {
        clicks: false,
        forms: false,
        scroll: false,
    },
};

function startBrowserSync() {
    return new Promise(resolve => {
        const bs = browserSync.create();
        bs.init(
            {
                host,
                port: browserSyncPort,
                proxy: {
                    target: `${host}:${nodeServerPort}`,
                },
                files: ['build/public/*.css'],
                ...browserSyncOptions,
            },
            () => {
                resolve();
            }
        );
    });
}

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
    const redis = new RedisServer();

    await redis.open().catch(error => {
        log.error('redis:', error.message);
    });

    await run(clean);
    await run(copy);
    await run(bundleDll);

    if (__HMR__ === false) {
        await run(watchFrontend);
    }

    if (__HMR__ === true) {
        await startBrowserSync();
    }

    await run(watchServer);
}

module.exports = start;
