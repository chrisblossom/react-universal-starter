/* eslint strict:off, global-require:off */

'use strict';

module.exports = (/* { file, options, env } */) => {
    return {
        plugins: {
            autoprefixer: {
                grid: true,
            },
        },
    };
};
