/* @flow */

const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const BrowserSync = require('browser-sync');

const envConfig = require('../config/env');
const { __HMR__ } = envConfig.globals;

const browserSyncPort = parseInt(process.env.PORT, 10) || 3000;
const nodeServerPort = __HMR__ === true ? browserSyncPort + 2 : browserSyncPort;

process.env.HOST = process.env.HOST || 'http://localhost';
process.env.PORT = nodeServerPort.toString();

const host = process.env.HOST || 'http://localhost';
const browserSyncOptions = {
    online: false,
    open: false,
    notify: false,
    xip: false,
    tunnel: false,
    ghostMode: {
        clicks: false,
        forms: false,
        scroll: false,
    },
};

function browserSync(clientBundle) {
    return new Promise(resolve => {
        const clientMiddleware = new WebpackDevMiddleware(clientBundle, {
            quiet: true,
            publicPath: clientBundle.options.output.publicPath,
            headers: { 'Access-Control-Allow-Origin': '*' },
        });

        const hotMiddleware = new WebpackHotMiddleware(clientBundle, {
            log: () => {},
        });

        const waitUntilValid = (req, res, next) => {
            clientMiddleware.waitUntilValid(() => {
                next();
            });
        };

        const bs = new BrowserSync.create();
        bs.init(
            {
                host,
                port: browserSyncPort,
                proxy: {
                    target: `${host}:${nodeServerPort}`,
                    middleware: [
                        clientMiddleware,
                        hotMiddleware,
                        waitUntilValid,
                    ],
                },
                files: ['build/public/*.css'],
                ...browserSyncOptions,
            },
            () => {
                resolve();
            }
        );
    });
}

module.exports = browserSync;
