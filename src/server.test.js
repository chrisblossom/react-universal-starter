/* @flow */

import { /* html, */ getScripts, getStyles } from './server';

// it('renders html', () => {
// const result = html();
// });

it('getScripts', () => {
    const scripts = ['bootstrap.js', 'main.cb66a042.js'];

    const result = getScripts(scripts);

    expect(result).toMatchSnapshot();
});

it('getStyles', () => {
    const styles = ['main.css', 'second.css'];

    const result = getStyles(styles);

    expect(result).toMatchSnapshot();
});
