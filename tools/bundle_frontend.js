/* @flow */

const webpack = require('webpack');
const log = require('./utils/log');

function writeBundle(webpackBundle) {
    return new Promise(resolve => {
        let finished = false;
        webpackBundle.run((error, stats) => {
            if (error) {
                log.error(error);

                return;
            }

            log.info(
                `${webpackBundle.name} ${stats
                    .toString({
                        version: false,
                        assets: false,
                        chunks: false,
                        colors: true,
                        hash: true,
                        modules: false,
                        reasons: false,
                        source: false,
                    })
                    .replace(/\n/, ' ')}`
            );

            if (finished === false) {
                finished = true;
                resolve();
            }
        });
    });
}

/**
 * Creates application bundles from the source files.
 */
async function bundle() {
    const clientConfig = require('./webpack/client');
    const serverConfig = require('./webpack/server');

    const multiCompiler = webpack([clientConfig, serverConfig]);

    const clientBundler = multiCompiler.compilers.find(compiler => {
        return compiler.options.name === 'client';
    });

    const nodeBundler = multiCompiler.compilers.find(compiler => {
        return compiler.options.name === 'server';
    });

    await Promise.all([writeBundle(clientBundler), writeBundle(nodeBundler)]);
}

module.exports = bundle;
