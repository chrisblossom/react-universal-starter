/* eslint-disable strict */

'use strict';

const globals = require('./env').globals;

const define = Object.assign({}, globals, {
    __SERVER__: true,
    __CLIENT__: false,
});

const babel = {
    presets: [
        [
            'env',
            {
                targets: {
                    node: '6.10',
                },
                useBuiltIns: true,
            },
        ],
        'react',
    ],

    plugins: [
        ['transform-define', define],
        'dynamic-import-node',
        'transform-object-rest-spread',
    ],
};

module.exports = babel;
