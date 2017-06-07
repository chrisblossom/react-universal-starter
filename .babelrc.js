'use strict';

const babel = {
    presets: [
        [
            'env',
            {
                targets: {
                    node: 'current',
                },
                useBuiltIns: true,
            },
        ],
        'flow',
    ],
    plugins: ['transform-object-rest-spread'],
};

module.exports = babel;
