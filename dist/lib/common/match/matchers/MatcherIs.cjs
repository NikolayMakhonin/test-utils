'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common_match_Matcher = require('../Matcher.cjs');

class MatcherIs extends common_match_Matcher.Matcher {
    constructor(expected, nonStrict) {
        super();
        this._expected = expected;
        this._nonStrict = nonStrict || false;
    }
    get async() {
        return false;
    }
    match(actual) {
        return this._nonStrict
            // eslint-disable-next-line eqeqeq
            ? actual == this._expected
            : actual === this._expected;
    }
    toString() {
        return `is.${this._nonStrict ? 'nonStrict' : 'strict'}(${JSON.stringify(this._expected, null, 2)})`;
    }
}

exports.MatcherIs = MatcherIs;
