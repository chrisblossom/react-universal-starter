/* @flow */

const log = require('./utils/log');
const run = require('./run');
const clean = require('./clean');
const copy = require('./copy');
const bundleDll = require('./bundle_dll');
const RedisServer = require('redis-server');
const watchServer = require('./watch_server');
const watchFrontend = require('./watch_frontend');

async function start() {
    const redis = new RedisServer();

    await redis.open().catch(error => {
        log.error('redis:', error.message);
    });

    await run(clean);
    await run(copy);
    await run(bundleDll);

    await run(watchFrontend);
    await run(watchServer);
}

module.exports = start;
