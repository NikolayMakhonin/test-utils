'use strict';

require('../../common/register/register.cjs');
require('./expect.cjs');
var expect = require('expect');
require('assert');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var expect__default = /*#__PURE__*/_interopDefaultLegacy(expect);

global.expect = expect__default["default"];
