/* @flow */

import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { existsSync } from 'fs';
import path from 'path';
import { flushWebpackRequireWeakIds } from 'react-loadable';

import flushChunks from 'webpack-flush-chunks';

import App from './app';

const rootPath = path.resolve(__dirname);
const publicPath = path.resolve(rootPath, 'public');

const getScripts = (scripts: Array<string>) => {
    return scripts.reduce(
        (acc, script: string) => {
            const scriptPath = `/dist/${script}`;

            const preload = (
                <link
                    rel="preload"
                    href={scriptPath}
                    key={script}
                    as="script"
                />
            );

            const scriptTag = (
                <script
                    src={scriptPath}
                    key={script}
                    type="text/javascript"
                    defer
                />
            );

            return {
                preload: [...acc.preload, preload],
                scripts: [...acc.scripts, scriptTag],
            };
        },
        {
            preload: [],
            scripts: [],
        },
    );
};

const getStyles = (styles: Array<string>) => {
    return styles.map((style: string) => {
        const stylePath = `/dist/${style}`;

        return (
            <link
                href={stylePath}
                key={style}
                media="screen, projection"
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
            />
        );
    });
};

/**
 * Used in development
 */
const vendorDllFileExists = existsSync(
    path.resolve(publicPath, 'vendor.dll.js'),
);

type PropsType = {
    clientStats: Object,
    outputPath: string,
};

function Html({ clientStats, outputPath }: PropsType) {
    const content = renderToString(<App />);

    const moduleIds = flushWebpackRequireWeakIds();

    const assets = flushChunks(clientStats, {
        before: ['bootstrap'],
        after: ['main'],

        moduleIds,

        // only needed if serving css rather than an external stylesheet
        outputPath,
    });

    const { preload, scripts } = getScripts(assets.scripts);
    const styles = getStyles(assets.stylesheets);

    return (
        <html lang="en-US">
            <head>
                <title>react-safe-universal-inputs demo</title>

                {styles}
                {preload}
            </head>

            <body>
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="root" dangerouslySetInnerHTML={{ __html: content }} />

                {vendorDllFileExists &&
                    <script
                        src={'/dist/vendor.dll.js'}
                        defer
                        charSet="UTF-8"
                    />}

                {scripts}
            </body>
        </html>
    );
}

type Options = {
    clientStats: Object,
    outputPath: string,
};

const html = (options: Options) => {
    return (
        request: express$Request,
        response: express$Response,
        // eslint-disable-next-line no-unused-vars
        next: express$NextFunction,
    ) => {
        const rendered = renderToStaticMarkup(<Html {...options} />);

        response.send(`<!DOCTYPE html>${rendered}`);
    };
};

export { getScripts, getStyles };
export default html;
