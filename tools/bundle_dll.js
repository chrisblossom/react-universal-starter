/* @flow */

const webpack = require('webpack');
const dllConfig = require('./webpack/dll');
const config = require('./config/env');

const { __DEVELOPMENT__ } = config.globals;

/**
 * Creates application bundles from the source files.
 */
function bundleDll() {
    return new Promise((resolve, reject) => {
        if (!__DEVELOPMENT__) {
            resolve();
            return;
        }

        webpack(dllConfig).run(error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

module.exports = bundleDll;
