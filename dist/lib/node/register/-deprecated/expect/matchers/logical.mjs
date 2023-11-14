import { expectedToString, expectEquals } from './helpers.mjs';

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
            const pass = expectEquals(received, expected);
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
            .map(expectedToString)
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
            const pass = expectEquals(received, expected);
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
            .map(expectedToString)
            .join(' | ')})`;
    };
    return _expectAnd;
}

export { expectAnd, expectOr };
