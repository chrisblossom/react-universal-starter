// @flow

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import Test from './test';

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
                <Test />
                app1
                <LoadableMyComponent />
            </div>
        );
    }
}
