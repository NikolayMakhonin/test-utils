'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function expectEquals(receiver, expected) {
    if (receiver === expected) {
        return true;
    }
    if (expected && typeof expected.asymmetricMatch === 'function') {
        return expected.asymmetricMatch(receiver);
    }
    return false;
}
function expectedToString(expected) {
    if (typeof expected.toAsymmetricMatcher === 'function') {
        return expected.toAsymmetricMatcher();
    }
    return expected + '';
}

exports.expectEquals = expectEquals;
exports.expectedToString = expectedToString;
