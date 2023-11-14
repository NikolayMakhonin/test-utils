'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function matchSet(actual, expected, options) {
    if (!(options === null || options === void 0 ? void 0 : options.mayNotContained)) {
        for (const actualValue of actual) {
            if (!expected.has(actualValue)) {
                return false;
            }
        }
    }
    if (!(options === null || options === void 0 ? void 0 : options.mayNotContains)) {
        for (const expectedValue of expected) {
            if (!actual.has(expectedValue)) {
                return false;
            }
        }
    }
    return true;
}

exports.matchSet = matchSet;
