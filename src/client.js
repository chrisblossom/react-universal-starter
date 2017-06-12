/* @flow */

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import App from './app';

const htmlTargetDivId = document.getElementById('root');

function renderClient(Component) {
    if (__HMR__) {
        const AppContainer = require('react-hot-loader/lib/AppContainer');

        render(
            <AppContainer>
                <Component />
            </AppContainer>,
            htmlTargetDivId,
        );

        return;
    }

    render(<Component />, htmlTargetDivId);
}

renderClient(App);

if (__HMR__ && module.hot) {
    // $FlowFixMe
    module.hot.accept('./app', () => {
        renderClient(App);
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
