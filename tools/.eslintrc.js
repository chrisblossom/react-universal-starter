'use strict';

module.exports = {
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'script',
        ecmaFeatures: {
            jsx: false,
            experimentalObjectRestSpread: false,
        },
    },
    env: {
        browser: false,
    },
    rules: {
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'never',
                exports: 'never',
                functions: 'never',
            },
        ],
    },
    globals: {
        __PRODUCTION_RELEASE__: false,
        __DEVELOPMENT__: false,
        __CLIENT__: false,
        __SERVER__: false,
        __HMR__: false,
    },
};
