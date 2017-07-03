/* @flow */

/* eslint-disable import/no-dynamic-require */

import 'babel-polyfill';

import path from 'path';
import express from 'express';
import http from 'http';

import Renderer from './renderer';

const app = express();
const server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');
const render = new Renderer();

app.set('etag', false);
app.use('/dist/', express.static(publicPath));


app.use((request, response) => {
    const rendered = render();

    response.send(`<!DOCTYPE html>${rendered}`);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

server.listen(port, error => {
    if (error) {
        console.error('express start error', error);

        return;
    }

    console.log('express server started on port', port);
});
