/* eslint strict:off, global-require:off */

'use strict';

require('babel-polyfill');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = false;
