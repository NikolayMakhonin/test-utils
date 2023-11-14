'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var common_match_Matcher = require('./Matcher.cjs');
var asyncUtils = require('@flemist/async-utils');
var common_match_MatchInternalError = require('./MatchInternalError.cjs');
var common_match_helpers = require('./helpers.cjs');

function validateMatchResult(_result) {
    const { result, cause, nested, error, } = _result;
    if (error) {
        if (!(error instanceof Error)) {
            throw new common_match_MatchInternalError.MatchInternalError(`error must be an instance of Error, but it is: ${error}`);
        }
        if (result != null) {
            throw new common_match_MatchInternalError.MatchInternalError(`result must be null if error is set, but it is: ${result}`);
        }
        if (cause != null) {
            throw new common_match_MatchInternalError.MatchInternalError(`cause must be null if error is set, but it is: ${cause}`);
        }
        if (nested != null) {
            throw new common_match_MatchInternalError.MatchInternalError(`nested must be null if error is set, but it is: ${nested}`);
        }
        return _result;
    }
    if (typeof result !== 'boolean') {
        throw new common_match_MatchInternalError.MatchInternalError(`result must be a boolean, but it is: ${result}`);
    }
    if (typeof cause !== 'string' && cause != null) {
        throw new common_match_MatchInternalError.MatchInternalError(`cause must be a string or null, but it is: ${cause}`);
    }
    if (nested != null && !(nested instanceof Array)) {
        throw new common_match_MatchInternalError.MatchInternalError(`nested must be an array or null, but it is: ${nested}`);
    }
    return _result;
}
function createMatchResultError(actual, expected, error) {
    return validateMatchResult({
        actual,
        expected,
        result: null,
        cause: null,
        nested: null,
        error,
    });
}
function createMatchResultBoolean(actual, expected, result) {
    return validateMatchResult({
        actual,
        expected,
        result,
        cause: null,
        nested: null,
        error: null,
    });
}
function createMatchResultSync(actual, expected, result) {
    if (typeof result === 'boolean') {
        return createMatchResultBoolean(actual, expected, result);
    }
    if (typeof result === 'string') {
        return validateMatchResult({
            actual,
            expected,
            result: false,
            cause: result,
            nested: null,
            error: null,
        });
    }
    return validateMatchResult({
        actual,
        expected,
        result: result.result,
        cause: result.cause,
        nested: result.nested,
        error: null,
    });
}
function matchSync(actual, expected) {
    try {
        if (expected instanceof common_match_Matcher.Matcher) {
            if (expected.async) {
                const error = new common_match_MatchInternalError.MatchInternalError('expected matcher is async but should be sync');
                return createMatchResultError(actual, expected, error);
            }
            const result = expected.match(actual);
            return createMatchResultSync(actual, expected, result);
        }
        return createMatchResultBoolean(actual, expected, actual === expected);
    }
    catch (error) {
        return createMatchResultError(actual, expected, error);
    }
}
function createMatchResultAsync(actual, expected, result) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        try {
            const resultValue = yield result;
            return createMatchResultSync(actual, expected, resultValue);
        }
        catch (error) {
            return createMatchResultError(actual, expected, error);
        }
    });
}
function matchAsync(actual, expected) {
    try {
        if (expected instanceof common_match_Matcher.Matcher) {
            const result = expected.match(actual);
            if (asyncUtils.isPromiseLike(result)) {
                if (!expected.async) {
                    const error = new common_match_MatchInternalError.MatchInternalError('expected matcher is not async but returned a promise');
                    return createMatchResultError(actual, expected, error);
                }
                return createMatchResultAsync(actual, expected, result);
            }
            return createMatchResultSync(actual, expected, result);
        }
        return createMatchResultBoolean(actual, expected, actual === expected);
    }
    catch (error) {
        return createMatchResultError(actual, expected, error);
    }
}
function match(actual, expected) {
    return common_match_helpers.isSyncMatcher(expected)
        ? matchSync(actual, expected)
        : matchAsync(actual, expected);
}

exports.createMatchResultSync = createMatchResultSync;
exports.match = match;
exports.matchAsync = matchAsync;
exports.matchSync = matchSync;
