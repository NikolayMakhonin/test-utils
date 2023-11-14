'use strict';

require('../../common/register/register.cjs');
var node_register_Deprecated_expect_expect = require('./-deprecated/expect/expect.cjs');
require('assert');
require('expect');

global.expect = node_register_Deprecated_expect_expect["default"];
