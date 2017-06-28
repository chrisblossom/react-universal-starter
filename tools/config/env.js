/* @flow */

/* eslint-disable strict */

'use strict';

const path = require('path');

const config = {
    paths: {
        rootPath: process.cwd(),
        buildPath: path.resolve(process.cwd(), 'build/'),
        serverBuildPath: path.resolve(process.cwd(), 'build/server/'),
        publicPath: path.resolve(process.cwd(), 'build/public/'),
        srcPath: path.resolve(process.cwd(), 'src/'),
        serverSrcPath: path.resolve(process.cwd(), 'server/'),
        staticPath: path.resolve(process.cwd(), 'static/'),
    },

    globals: {
        __PRODUCTION_RELEASE__: process.env.CIRCLE_BRANCH === 'master',

        __DEVELOPMENT__: process.env.NODE_ENV
            ? process.env.NODE_ENV === 'development'
            : true,

        __HMR__:
            process.env.RUN_MODE === 'start' && process.env.HMR
                ? // Always disable HMR in production-like environments
                  process.env.HMR === 'true' &&
                  process.env.NODE_ENV !== 'production'
                : false,
    },
};

module.exports = config;
