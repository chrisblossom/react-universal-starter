#!/usr/bin/env node
/* eslint-disable strict, import/no-dynamic-require */

'use strict';

function run(fn, options) {
    const task = typeof fn.default === 'undefined' ? fn : fn.default;

    const log = require('./utils/log');

    /**
     * push to back of stack for correct starting/finishing logging order
     */
    return new Promise(resolve => {
        setImmediate(() => {
            const logPrefix = `${task.name}:${process.env.NODE_ENV}`;

            const { time: start } = log.info(`Starting '${logPrefix}'...`);
            const runningTask = task(options)
                .then(resolution => {
                    const end = new Date();
                    const time = end.getTime() - start.getTime();
                    process.nextTick(() => {
                        log.info(`Finished '${logPrefix}' after ${time} ms`);
                    });

                    return resolution;
                })
                .catch(error => {
                    const end = new Date();
                    const time = end.getTime() - start.getTime();

                    if (error instanceof Error) {
                        log.error(logPrefix, error.stack);
                    } else if (error) {
                        log.error(logPrefix, 'Error:', error);
                    }

                    log.error(`Finished '${logPrefix}' after ${time} ms`);

                    process.exit(1);
                });

            resolve(runningTask);
        });
    });
}

if (require.main === module && process.argv.length > 2) {
    /**
     * Setup default NODE_ENV
     * usage: npm run TASK -- --ENV
     *
     * Available options:
     *  --release (--rel), --production (--prod)
     *  --testing (--test)
     *  --development (--dev) [default]
     *
     * Defaults to development
     */
    const processArgv = process.argv.join();

    const dotenv = require('dotenv');
    dotenv.config();

    const task = process.argv[2];

    process.env.RUN_MODE = task;

    if (processArgv.includes('--rel') || processArgv.includes('--prod')) {
        process.env.NODE_ENV = 'production';
    }

    if (processArgv.includes('--test')) {
        process.env.NODE_ENV = 'test';
    }

    if (process.env.NODE_ENV === undefined) {
        process.env.NODE_ENV = 'development';
    }

    delete require.cache[__filename];

    const module = require(`./${task}.js`);
    run(module);
}

module.exports = run;
