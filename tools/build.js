/* @flow */

const run = require('./run');
const clean = require('./clean');
const copy = require('./copy');
const bundleDll = require('./bundle_dll');
const bundleFrontend = require('./bundle_frontend');
const bundleServer = require('./bundle_server');
const postBuild = require('./post_build');

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
    await run(clean);
    await run(copy);
    await run(bundleDll);
    await Promise.all([await run(bundleFrontend), await run(bundleServer)]);
    await run(postBuild);
}

module.exports = build;
