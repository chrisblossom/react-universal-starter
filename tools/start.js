/* @flow */

const run = require('./run');
const clean = require('./clean');
const copy = require('./copy');
const bundleDll = require('./bundle_dll');
const watchServer = require('./watch_server');
const watchFrontend = require('./watch_frontend');

async function start() {
    await run(clean);
    await run(copy);
    await run(bundleDll);

    await run(watchFrontend);
    await run(watchServer);
}

module.exports = start;
