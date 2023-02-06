'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var expect = require('expect');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var expect__default = /*#__PURE__*/_interopDefaultLegacy(expect);

expect__default["default"].extend({
    or(received, ...expecteds) {
        function message() {
            return `expected ${expecteds
                .map(expected => this.utils.printExpected(expected))
                .join(' | ')}, but received ${this.utils.printReceived(received)}`;
        }
        for (let i = 0, len = expecteds.length; i < len; i++) {
            const expected = expecteds[i];
            if ((expected
                && typeof expected.asymmetricMatch === 'function'
                && expected.asymmetricMatch(received))
                || received === expected) {
                return {
                    pass: true,
                    message,
                };
            }
        }
        return {
            pass: false,
            message,
        };
    },
});

Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () { return expect__default["default"]; }
});
