/* @flow */

const { writeFileSync } = require('fs');
const path = require('path');
const webpack = require('webpack');
const log = require('./utils/log');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const envConfig = require('./config/env');

const { buildPath } = envConfig.paths;

/**
 * Creates application bundles from the source files.
 */
function watchBundle(webpackBundle) {
    return new Promise(resolve => {
        let finished = false;
        webpackBundle.watch({}, (error, stats) => {
            if (error) {
                // log.error(error);

                return;
            }

            if (webpackBundle.name === 'client') {
                const outputFile = path.resolve(
                    buildPath,
                    'webpack-stats.json'
                );
                writeFileSync(outputFile, JSON.stringify(stats.toJson()));
            }

            // if (webpackBundle.name === 'server') {
            // log.info(
            //     `${webpackBundle.name} ${stats
            //         .toString({
            //             version: false,
            //             assets: false,
            //             chunks: false,
            //             colors: true,
            //             hash: true,
            //             modules: false,
            //             reasons: false,
            //             source: false,
            //         })
            //         .replace(/\n/, ' ')}`,
            // );
            // }

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

    await Promise.all([watchBundle(clientBundler), watchBundle(nodeBundler)]);
}

module.exports = watchFrontend;
