'use strict';

module.exports = {
    extends: [
        'plugin:jest/recommended',
        'prettier',
        'prettier/flowtype',
        'prettier/react',
    ],
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    plugins: ['jest'],
    rules: {
        'no-underscore-dangle': [
            2,
            {
                allowAfterThis: false,
                allow: [
                    '__filename',
                    '__CLIENT__',
                    '__SERVER__',
                    '__DEVELOPMENT__',
                    '__HMR__',
                    '__PRODUCTION_RELEASE__',
                ],
            },
        ],

        'flowtype/type-id-match': 'off',
    },
    globals: {
        __PRODUCTION_RELEASE__: true,
        __DEVELOPMENT__: true,
        __CLIENT__: true,
        __SERVER__: true,
        __HMR__: true,
    },
    settings: {
        flowtype: {
            onlyFilesWithFlowAnnotation: true,
        },
    },
};
