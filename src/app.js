/* @flow */

import React, { Component } from 'react';
import universal from 'react-universal-component';

import styles from './app.css';

const LoadableMyComponent = universal(
    () => import(/* webpackChunkName: 'app2' */ './app2'),
    {
        resolve: () => require.resolveWeak('./app2'),
    },
);

export default class Application extends Component {
    componentDidMount() {
        console.log('loaded');
    }

    render() {
        return (
            <div>
                <div className={styles.app}>
                    app1
                </div>
                <LoadableMyComponent />
            </div>
        );
    }
}
