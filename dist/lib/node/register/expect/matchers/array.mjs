import { expectedToString, expectEquals } from './helpers.mjs';

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
            const pass = expectEquals(received, expected);
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
        return expectedToString(expected);
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
        const pass = expectEquals(receivedArray.length, expected);
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

export { expectArrayItems, expectArrayLength };
