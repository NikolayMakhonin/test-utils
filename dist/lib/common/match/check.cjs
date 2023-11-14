'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var asyncUtils = require('@flemist/async-utils');

function throwError(matchResult) {
    throw new Error('check failed'); // TODO: implement error message builder
}
function checkSync(matchResult) {
    if (matchResult.result === false) {
        throwError();
    }
}
function checkAsync(matchResultAsync) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        const matchResult = yield matchResultAsync;
        if (matchResult.result === false) {
            throwError();
        }
    });
}
function check(matchResult) {
    if (asyncUtils.isPromiseLike(matchResult)) {
        return checkAsync(matchResult);
    }
    checkSync(matchResult);
}

exports.check = check;
exports.checkAsync = checkAsync;
exports.checkSync = checkSync;
