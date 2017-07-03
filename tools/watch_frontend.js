/* @flow */

const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const browserSync = require('./utils/browser_sync');

const envConfig = require('./config/env');
const { __HMR__ } = envConfig.globals;

/**
 * Creates application bundles from the source files.
 */
function watchBundle(webpackBundle) {
    return new Promise(resolve => {
        let finished = false;
        webpackBundle.watch({}, error => {
            if (error) {
                // log.error(error);

                return;
            }

            if (finished === false) {
                finished = true;
                resolve();
            }
        });
    });
}

async function watchFrontend() {
    const clientConfig = require('./webpack/client');
    const serverConfig = require('./webpack/server');

    const multiCompiler = webpack([clientConfig, serverConfig]);

    multiCompiler.apply(
        new FriendlyErrorsWebpackPlugin({
            clearConsole: false,
        })
    );

    const clientBundler = multiCompiler.compilers.find(compiler => {
        return compiler.options.name === 'client';
    });

    const nodeBundler = multiCompiler.compilers.find(compiler => {
        return compiler.options.name === 'server';
    });

    const client = __HMR__
        ? browserSync(clientBundler)
        : watchBundle(clientBundler);

    const server = watchBundle(nodeBundler);

    await Promise.all([client, server]);
}

module.exports = watchFrontend;
