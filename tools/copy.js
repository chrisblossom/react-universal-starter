/* @flow */

const path = require('path');
const fse = require('fs-extra');
const config = require('./config/env');

const { publicPath, rootPath, staticPath } = config.paths;

const fs = require('fs');
const crypto = require('crypto');

const getHash = filePath => {
    const file = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(file).digest('hex');
};

// eslint-disable-next-line no-unused-vars
const getCopyParams = (sourceFilePath, rename: ?string) => {
    const src = path.resolve(rootPath, sourceFilePath);

    /**
     * extracts from path and returns only the base file-name
     * node_modules/raven-js/dist/raven.min.js -> raven
     */
    const baseFileName =
        rename || sourceFilePath.split('/').splice(-1)[0].split('.')[0];

    const md5 = getHash(src).substring(0, 7);

    const hashedFileName = `${baseFileName}.${md5}.js`;

    const dest = path.resolve(publicPath, hashedFileName);

    return {
        src,
        dest,
    };
};

const files = [
    {
        src: staticPath,
        dest: publicPath,
    },

    /**
     * sentry/raven
     */
    // getCopyParams('node_modules/raven-js/dist/raven.min.js'),
    // {
    //     src: path.resolve(rootPath, 'node_modules/raven-js/dist/raven.js'),
    //     dest: path.resolve(publicPath, 'raven.js'),
    // },
    // {
    //     src: path.resolve(rootPath, 'node_modules/raven-js/dist/raven.min.js.map'),
    //     dest: path.resolve(publicPath, 'raven.min.js.map'),
    // },

    /**
     * IE8 Stuff
     */
    // getCopyParams('node_modules/es5-shim/es5-shim.min.js'),
    // {
    //     src: path.resolve(rootPath, 'node_modules/es5-shim/es5-shim.js'),
    //     dest: path.resolve(publicPath, 'es5-shim.js'),
    // },
    // {
    //     src: path.resolve(rootPath, 'node_modules/es5-shim/es5-shim.map'),
    //     dest: path.resolve(publicPath, 'es5-shim.map'),
    // },
    // getCopyParams('node_modules/es5-shim/es5-sham.min.js'),
    // {
    //     src: path.resolve(rootPath, 'node_modules/es5-shim/es5-sham.map'),
    //     dest: path.resolve(publicPath, 'es5-sham.map'),
    // },
    // {
    //     src: path.resolve(process.cwd(), 'node_modules/es5-shim/es5-sham.js'),
    //     dest: path.resolve(publicPath, 'es5-sham.js'),
    // },
    // getCopyParams('node_modules/console-polyfill/index.js', 'console-polyfill'),
    //
    // getCopyParams('node_modules/nwmatcher/src/nwmatcher.js'),
];

async function copy() {
    try {
        await Promise.all(
            files.map(file => {
                return fse.copy(file.src, file.dest);
            })
        );
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = copy;
