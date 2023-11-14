'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var common_match_match = require('./match.cjs');
var asyncUtils = require('@flemist/async-utils');
require('./Matcher.cjs');
require('./MatchInternalError.cjs');
require('./helpers.cjs');

class Checker {
    constructor(async, actual) {
        this._promises = [];
        this.actual = actual;
        this._async = async || false;
    }
    get async() {
        return this._async;
    }
    throwError(result) {
        throw new Error('check failed'); // TODO: implement error message builder
    }
    checkSync(expected) {
        const result = common_match_match.matchSync(this.actual, expected);
        if (result.result === false) {
            this.throwError(result);
        }
    }
    checkAsync(expected) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            const result = yield common_match_match.matchAsync(this.actual, expected);
            if (result.result === false) {
                this.throwError(result);
            }
        });
    }
    check(expected) {
        if (this.async) {
            const result = this.checkAsync(expected);
            if (asyncUtils.isPromiseLike(result)) {
                this._promises.push(result);
            }
            return this;
        }
        this.checkSync(expected);
        return this;
    }
    then(resolve, reject) {
        return Promise.all(this._promises)
            .then(() => resolve(), () => reject());
    }
}
function checkSync(actual) {
    const checker = new Checker(false, actual);
    function check(expected) {
        void checker.check(expected);
        return check;
    }
    return check;
}
function checkAsync(actual) {
    const checker = new Checker(true, actual);
    function check(expected) {
        void checker.check(expected);
        return check;
    }
    check.then = function then(resolve, reject) {
        return checker.then(resolve, reject);
    };
    return check;
}
const check = checkSync;
check.async = checkAsync;

exports.Checker = Checker;
exports.check = check;
exports.checkAsync = checkAsync;
exports.checkSync = checkSync;
