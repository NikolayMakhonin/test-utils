'use strict';

require('../../common/register/register.cjs');
var node_register_expect_expect = require('./expect/expect.cjs');
require('assert');
require('expect');

global.expect = node_register_expect_expect["default"];
