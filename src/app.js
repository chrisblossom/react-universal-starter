// @flow

import React, { Component } from 'react';
import Loadable from 'react-loadable';

const LoadableMyComponent = Loadable({
    loader: () => {
        return import('./app2');
    },
});

export default class Application extends Component {
    componentDidMount() {
        console.log('loaded');
    }

    render() {
        return (
            <div>
               app1
                <LoadableMyComponent />
            </div>
        );
    }
}
