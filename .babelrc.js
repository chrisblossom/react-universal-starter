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

if (process.env.NODE_ENV === 'test') {
    babel.presets.push('react');
    babel.plugins.push('dynamic-import-node');
}


module.exports = babel;
