/* @flow */

const path = require('path');
const del = require('del');
const fse = require('fs-extra');
const config = require('./config/env');

const { buildPath, publicPath, serverBuildPath } = config.paths;

const defaultParams = {
    del: [path.resolve(buildPath, '*')],
    mkdirp: [publicPath, serverBuildPath],
};

type Params = {
    del: Array<string>,
    mkdirp?: Array<string>,
};

async function mkdirp(dirs) {
    await Promise.all(
        dirs.map(dir => {
            return fse.ensureDir(dir);
        })
    );
}

async function clean(params: Params = defaultParams) {
    await del(params.del, { dot: true });

    if (params.mkdirp) {
        await mkdirp(params.mkdirp);
    }
}

module.exports = clean;
