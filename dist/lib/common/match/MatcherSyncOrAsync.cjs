'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common_match_Matcher = require('./Matcher.cjs');

class MatcherSyncOrAsync extends common_match_Matcher.Matcher {
    constructor(async) {
        super();
        this._async = async || false;
    }
    get async() {
        return this._async;
    }
    match(actual) {
        if (this.async) {
            return this.matchAsync(actual);
        }
        return this.matchSync(actual);
    }
}

exports.MatcherSyncOrAsync = MatcherSyncOrAsync;
