/* @flow */

/* eslint-disable strict */

'use strict';

const webpack = require('webpack');

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const shared = require('./shared');
const config = require('../config/env');

const { __DEVELOPMENT__, __HMR__, __PRODUCTION_RELEASE__ } = config.globals;
const { buildPath, publicPath, srcPath } = config.paths;

const client = {
    name: 'client',
    devtool: __DEVELOPMENT__ ? 'cheap-module-source-map' : 'source-map',
    target: 'web',

    context: srcPath,

    entry: {
        main: ['client.js'],
    },

    output: {
        path: publicPath,
        filename: '[name].[hash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
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
                                            browsers: ['> 0%'],
                                            uglify: true,
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: process.env.NODE_ENV === 'production',
                                sourceMap: true,
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[local]___[hash:base64:5]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: process.env.NODE_ENV === 'production',
                                sourceMap: true,
                                modules: true,
                                importLoaders: 2,
                                localIdentName: '[local]___[hash:base64:5]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                outputStyle: 'expanded',
                                sourceMapContents: true,
                            },
                        },
                    ],
                }),
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin(
            Object.assign({}, shared.definePlugin, {
                __CLIENT__: true,
                __SERVER__: false,
            })
        ),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
            filename: '[name].js',
            minChunks: Infinity,
        }),
    ],
};

if (__DEVELOPMENT__ === true) {
    if (__HMR__ === true) {
        // $FlowIgnore
        client.module.rules
            .find(rules => {
                return new RegExp(rules.test).test('.jsx');
            })
            .use.find(loader => {
                return loader.loader === 'babel-loader';
            })
            .options.plugins.unshift('react-hot-loader/babel');

        client.entry.main.unshift(
            'eventsource-polyfill',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
            'react-hot-loader/patch'
        );

        client.plugins.unshift(
            new WriteFilePlugin({ test: /\.css$/, log: false }),
            new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
            new webpack.HotModuleReplacementPlugin()
        );
    } else {
        client.plugins.unshift(
            new ExtractTextPlugin({
                filename: '[name].[contenthash:8].css',
                allChunks: true,
            })
        );
    }

    client.plugins.unshift(
        new webpack.NamedModulesPlugin(),
        new webpack.DllReferencePlugin({
            context: srcPath,

            /* eslint-disable import/no-dynamic-require */
            // The path to the generated vendor-manifest file
            manifest: require(path.join(buildPath, 'vendor-manifest.dll.json')),
            /* eslint-enable */
        })
    );
}

/**
 * Client production config
 */
if (__DEVELOPMENT__ === false) {
    client.plugins.unshift(
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css',
            allChunks: true,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false,
            },
            mangle: {
                screw_ie8: true,
                except: ['eventId', 'fieldsObject', 'trackingId'],
            },
            output: {
                screw_ie8: true,
                comments: false,
            },
            sourceMap: true,
        })
    );
}

if (__PRODUCTION_RELEASE__ === false) {
    client.plugins.unshift(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = client;
