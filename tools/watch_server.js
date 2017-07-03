/* @flow */

const path = require('path');
const nodemon = require('nodemon');
const config = require('./config/env');
const compileServer = require('./utils/compile_server');

const { rootPath, serverBuildPath } = config.paths;

function watchServer() {
    return new Promise(async resolve => {
        await compileServer({ watch: true });

        /**
         * https://github.com/remy/nodemon/blob/master/doc/requireable.md
         */
        nodemon({
            script: path.resolve(rootPath, 'start.js'),
            watch: serverBuildPath,
            // delay: 500,
        });

        nodemon.once('start', () => {
            resolve();
        });

        /**
         * Fix for terminal error
         * https://github.com/JacksonGariety/gulp-nodemon/issues/77#issuecomment-277749901
         */
        nodemon.on('quit', () => {
            process.exit();
        });
    });
}

module.exports = watchServer;
