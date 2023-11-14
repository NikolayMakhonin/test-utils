'use strict';

require('../../common/register/register.cjs');
require('./expect.cjs');
var expect = require('expect');
require('assert');

global.expect = expect.expect;
