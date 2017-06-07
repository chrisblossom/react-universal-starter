// @flow

import React, { Component } from 'react';
import Loadable from 'react-loadable';

type Props = {
    isLoading: boolean,
    error: Error | null,
    pastDelay: null,
};

const MyLoadingComponent = ({ isLoading, error, pastDelay }: Props) => {
    if (isLoading) {
        return pastDelay ? <div>Loading...</div> : null; // Don't flash "Loading..." when we don't need to.
    } else if (error) {
        return <div>Error! Component failed to load</div>;
    }
    return null;
};

const LoadableMyComponent = Loadable({
    loader: () => {
        return import('./app2');
    },
    LoadingComponent: MyLoadingComponent,
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
