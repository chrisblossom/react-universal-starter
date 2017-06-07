/* @flow */

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import App from './app';

const htmlTargetDivId = document.getElementById('root');

function renderClient() {
    render(<App />, htmlTargetDivId);
}

renderClient();

if (__DEVELOPMENT__ && module.hot) {
    // $FlowFixMe
    module.hot.accept('./app', () => {
        renderClient();
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
