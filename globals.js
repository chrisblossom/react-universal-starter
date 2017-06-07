/* eslint-disable strict */

'use strict';

const globals = {
    __PRODUCTION_RELEASE__: process.env.CIRCLE_BRANCH === 'master',

    __DEVELOPMENT__: process.env.NODE_ENV
        ? process.env.NODE_ENV === 'development'
        : true,

    __HMR__: process.env.HMR
        ? // Always disable HMR in production-like environments
          process.env.HMR === 'true' && process.env.NODE_ENV !== 'production'
        : false,
};
console.log(globals);

module.exports = globals;
