/* @flow */

/* eslint-disable strict */

'use strict';

const globals = require('../config/env').globals;

const shared = {
    definePlugin: Object.assign({}, globals, {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
};

module.exports = shared;
