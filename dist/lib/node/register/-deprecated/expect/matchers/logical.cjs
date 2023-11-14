'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_register_Deprecated_expect_matchers_helpers = require('./helpers.cjs');

function expectOr(...expecteds) {
    function _expectOr(received) {
        const _this = this;
        function message() {
            return `expected ${expecteds
                .map(expected => _this.utils.printExpected(expected))
                .join(' | ')}, but received ${_this.utils.printReceived(received)}`;
        }
        for (let i = 0, len = expecteds.length; i < len; i++) {
            const expected = expecteds[i];
            const pass = node_register_Deprecated_expect_matchers_helpers.expectEquals(received, expected);
            if (pass) {
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
    }
    _expectOr.toString = function toString() {
        return `or(${expecteds
            .map(node_register_Deprecated_expect_matchers_helpers.expectedToString)
            .join(' | ')})`;
    };
    return _expectOr;
}
function expectAnd(...expecteds) {
    function _expectAnd(received) {
        const _this = this;
        function message() {
            return `expected ${expecteds
                .map(expected => _this.utils.printExpected(expected))
                .join(' & ')}, but received ${_this.utils.printReceived(received)}`;
        }
        for (let i = 0, len = expecteds.length; i < len; i++) {
            const expected = expecteds[i];
            const pass = node_register_Deprecated_expect_matchers_helpers.expectEquals(received, expected);
            if (!pass) {
                return {
                    pass: false,
                    message,
                };
            }
        }
        return {
            pass: true,
            message,
        };
    }
    _expectAnd.toString = function toString() {
        return `and(${expecteds
            .map(node_register_Deprecated_expect_matchers_helpers.expectedToString)
            .join(' | ')})`;
    };
    return _expectAnd;
}

exports.expectAnd = expectAnd;
exports.expectOr = expectOr;
