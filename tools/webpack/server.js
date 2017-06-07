/* @flow */

/* eslint-disable strict */

'use strict';

const webpack = require('webpack');
const NodeExternals = require('webpack-node-externals');
const config = require('../config/env');
const shared = require('./shared');

const nodeModules = new NodeExternals({
    whitelist: ['react-loadable', 'webpack-flush-chunks'],
});

const { __DEVELOPMENT__, __PRODUCTION_RELEASE__ } = config.globals;
const { buildPath, srcPath } = config.paths;

const server = {
    name: 'server',
    devtool: __DEVELOPMENT__ ? 'cheap-module-source-map' : 'source-map',
    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false,
    },

    externals: [nodeModules],
    context: srcPath,

    entry: {
        main: ['server.js'],
    },

    output: {
        path: buildPath,
        filename: 'server-frontend.js',
        chunkFilename: 'server-frontend-[name]-[chunkhash].js',
        libraryTarget: 'commonjs2',
        publicPath: '/dist/',
    },

    resolve: {
        modules: [srcPath, 'node_modules'],
        extensions: ['.js'],
    },

    module: {
        rules: [
            {
                test: /\.jsx?$|.js.flow$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [
                                [
                                    'env',
                                    {
                                        targets: {
                                            node: '6.10',
                                        },
                                        modules: false,
                                        useBuiltIns: true,
                                    },
                                ],
                                'react',
                            ],
                            plugins: [
                                'syntax-dynamic-import',
                                'transform-object-rest-spread',
                                [
                                    'react-loadable/babel',
                                    {
                                        server: true,
                                        webpack: true,
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },

            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        // /locals lets us remove ExtractTextPlugin on the server
                        loader: 'css-loader/locals',
                        options: {
                            sourceMap: false,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]___[hash:base64:5]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            modules: true,
                            importLoaders: 2,
                            localIdentName: '[local]___[hash:base64:5]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            outputStyle: 'expanded',
                            sourceMapContents: false,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: `require('source-map-support').install();`,
            raw: true,
            entryOnly: false,
        }),

        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),

        new webpack.DefinePlugin(
            Object.assign({}, shared.definePlugin, {
                __CLIENT__: false,
                __SERVER__: true,
            })
        ),
    ],
};

if (__DEVELOPMENT__ === true) {
    server.plugins.unshift(new webpack.NamedModulesPlugin());
}

if (__PRODUCTION_RELEASE__ === false) {
    server.plugins.unshift(new webpack.NoEmitOnErrorsPlugin());
}

if (__DEVELOPMENT__ === false) {
    server.plugins.unshift(new webpack.HashedModuleIdsPlugin());
}

module.exports = server;
