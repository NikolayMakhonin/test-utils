'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common_match_Matcher = require('./Matcher.cjs');

function isIterator(obj) {
    return obj && typeof obj.next === 'function';
}
function isIterable(obj) {
    return obj && typeof obj[Symbol.iterator] === 'function';
}
function isSyncMatcher(expected) {
    return expected instanceof common_match_Matcher.Matcher && expected.async === false;
}

exports.isIterable = isIterable;
exports.isIterator = isIterator;
exports.isSyncMatcher = isSyncMatcher;
