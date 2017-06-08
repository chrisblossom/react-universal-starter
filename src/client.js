/* @flow */

import 'babel-polyfill';
import React from 'react';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import { render } from 'react-dom';

import App from './app';

const htmlTargetDivId = document.getElementById('root');

function renderClient(Entry) {
    render(
        <AppContainer>
            <Entry />
        </AppContainer>,
        htmlTargetDivId,
    );
}

renderClient(App);

if (__HMR__ && module.hot) {
    // $FlowFixMe
    module.hot.accept('./app', () => {
        const HotApp = require('./app').default;
        renderClient(HotApp);
    });
}

if (
    !htmlTargetDivId ||
    !htmlTargetDivId.firstChild ||
    !htmlTargetDivId.firstChild.attributes ||
    // $FlowFixMe
    !htmlTargetDivId.firstChild.attributes['data-react-checksum']
) {
    console.error(
        'Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.',
    );
}
