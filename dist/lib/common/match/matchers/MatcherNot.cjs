'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var common_match_match = require('../match.cjs');
var common_match_MatcherSyncOrAsync = require('../MatcherSyncOrAsync.cjs');
require('../Matcher.cjs');
require('@flemist/async-utils');
require('../MatchInternalError.cjs');
require('../helpers.cjs');

class MatcherNot extends common_match_MatcherSyncOrAsync.MatcherSyncOrAsync {
    constructor(async, expected) {
        super(async);
        this._expected = expected;
    }
    matchAsync(actual) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const nested = yield common_match_match.matchAsync(actual, this._expected);
            return {
                result: !nested.result,
                nested: [{
                        actualKey: null,
                        result: nested,
                    }],
            };
        });
    }
    matchSync(actual) {
        const nested = common_match_match.matchSync(actual, this._expected);
        return {
            result: !nested.result,
            nested: [{
                    actualKey: null,
                    result: nested,
                }],
        };
    }
    toString() {
        return `not(${this._expected})`;
    }
}

exports.MatcherNot = MatcherNot;
