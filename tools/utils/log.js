/* @flow */

/* eslint no-console:0 */

const { bgBlue, bgRed, bgGreen, white, gray } = require('chalk');

function getTime() {
    const addZero = time => {
        if (time < 10) {
            return `0${time}`;
        }

        return time;
    };

    const now = new Date();
    const hours = addZero(now.getHours());
    const minutes = addZero(now.getMinutes());
    const seconds = addZero(now.getSeconds());

    return {
        time: now,
        message: `[${gray(`${hours}:${minutes}:${seconds}`)}]`,
    };
}

function print(
    messages: Array<string>,
    format: string = '\b',
    type: string = 'info'
) {
    const time = getTime();
    const meta = `${time.message} ${format}`;

    const coloredMessages = messages.map(message => {
        return white(message);
    });

    console[type](meta, ...coloredMessages);

    return time;
}

function info(...messages: Array<string>) {
    const format = `${bgBlue(white('Info'))}${gray(':')}`;
    return print(messages, format, 'info');
}
const log = info;

function success(...messages: Array<string>) {
    const format = `${bgGreen(white('Success'))}${gray(':')}`;
    return print(messages, format, 'info');
}

function error(...messages: Array<string>) {
    const format = `${bgRed(white('Error'))}${gray(':')}`;
    return print(messages, format, 'error');
}

module.exports = { error, info, log, print, success };
