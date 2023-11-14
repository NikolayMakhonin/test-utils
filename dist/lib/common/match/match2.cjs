'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common_match_match = require('./match.cjs');
require('tslib');
require('./Matcher.cjs');
require('@flemist/async-utils');
require('./MatchInternalError.cjs');
require('./helpers.cjs');

function match(actual) {
    function _matchSync(expected) {
        return common_match_match.matchSync(actual, expected);
    }
    _matchSync.async = function _matchAsync(expected) {
        return common_match_match.matchAsync(actual, expected);
    };
    return _matchSync;
}
// match(1)(1)

exports.match = match;
