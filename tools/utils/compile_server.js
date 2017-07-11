/* @flow */

const log = require('./log');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const config = require('../config/env');

const { rootPath, serverBuildPath, serverSrcPath } = config.paths;

const serverEntryFile = path.resolve(serverBuildPath, 'index.js');
const babelrc = path.resolve(rootPath, 'tools/config/server_babelrc.js');

type Options = {
    watch?: boolean,
};

function compileServer(options: Options = {}) {
    return new Promise((resolve, reject) => {
        const args = [
            '--no-babelrc',
            serverSrcPath,
            '--out-dir',
            serverBuildPath,
            '--source-maps',
            `--presets=${babelrc}`,
        ];

        if (options.watch) {
            args.splice(1, 0, '--watch');
        }

        /**
         * Find the babel-cli bin using require instead of PATH
         */
        const babelCliPath = path.parse(require.resolve('babel-cli')).dir;
        const babelBinPath = path.resolve(babelCliPath, 'bin/babel.js');

        const node = spawn(babelBinPath, args, {
            env: Object.assign({}, process.env, { FORCE_COLOR: 'true' }),
        });

        node.on('close', code => {
            if (code !== 0) {
                reject();

                return;
            }

            resolve();
        });

        node.on('error', () => {
            reject();
            process.exit(1);
        });

        const now = new Date();
        let last = new Date();

        node.stdout.on('data', data => {
            log.info(
                data
                    .toString()
                    .replace(new RegExp(`${rootPath}/`, 'g'), '')
                    .replace(/\n/, ' ')
            );

            last = new Date();
        });

        node.stderr.on('data', data => {
            /**
             * Finish task when error printed
             */
            if (options.watch) {
                resolve();
            }

            log.error(
                data
                    .toString()
                    .replace(new RegExp(`${rootPath}/`), '')
                    .replace(/\n/, ' ')
            );

            last = new Date();
        });

        /**
         * With watch-mode we do not know when the initial build is complete.
         * Do our best to guess by watching stdout
         *
         * see node.stderr also
         */
        if (options.watch) {
            const isDone = () => {
                setTimeout(() => {
                    last = new Date();

                    const diff = last.getTime() - now.getTime();

                    const fileExists = fs.existsSync(serverEntryFile);
                    if (diff > 1000 && fileExists) {
                        resolve();

                        return;
                    }

                    isDone();
                }, 20);
            };

            isDone();
        }

        process.on('exit', () => {
            node.kill();

            process.exit();
        });
    });
}

module.exports = compileServer;
