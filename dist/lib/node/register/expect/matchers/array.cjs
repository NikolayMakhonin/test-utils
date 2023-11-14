'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_register_expect_matchers_helpers = require('./helpers.cjs');

function expectArrayItems(expected, options = {}) {
    function _expectArrayItems(receivedArray) {
        const _this = this;
        function message() {
            return `expected [${_this.utils.printExpected(expected)}], but received ${_this.utils.printReceived(receivedArray)}`;
        }
        if (!Array.isArray(receivedArray)) {
            return {
                pass: false,
                message,
            };
        }
        for (let i = 0, len = receivedArray.length; i < len; i++) {
            const received = receivedArray[i];
            const pass = node_register_expect_matchers_helpers.expectEquals(received, expected);
            if (!pass) {
                return {
                    pass: false,
                    message: () => `expected ${_this.utils.printExpected(expected)}, but received ${_this.utils.printReceived(received)}`,
                };
            }
        }
        return {
            pass: true,
            message,
        };
    }
    _expectArrayItems.toString = function toString() {
        return node_register_expect_matchers_helpers.expectedToString(expected);
    };
    return _expectArrayItems;
}
function expectArrayLength(expected) {
    function _expectArrayLength(receivedArray) {
        const _this = this;
        function message() {
            return `expected length ${_this.utils.printExpected(expected)}, but received ${_this.utils.printReceived(receivedArray === null || receivedArray === void 0 ? void 0 : receivedArray.length)}`;
        }
        if (!Array.isArray(receivedArray)) {
            return {
                pass: false,
                message,
            };
        }
        const pass = node_register_expect_matchers_helpers.expectEquals(receivedArray.length, expected);
        return {
            pass,
            message,
        };
    }
    _expectArrayLength.toString = function toString() {
        return `length(${expected})`;
    };
    return _expectArrayLength;
}

exports.expectArrayItems = expectArrayItems;
exports.expectArrayLength = expectArrayLength;
