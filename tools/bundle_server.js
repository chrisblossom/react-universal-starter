/* @flow */

const compileServer = require('./utils/compile_server');

async function bundleServer() {
    await compileServer({ watch: false });
}

module.exports = bundleServer;
