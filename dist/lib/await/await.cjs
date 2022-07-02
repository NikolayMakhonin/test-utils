'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');

function awaitCount(count) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < count; i++) {
            yield Promise.resolve();
        }
    });
}
function awaitTime(timeControllerMock, time, countPerTime) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        yield awaitCount(countPerTime);
        for (let i = 0; i < time; i++) {
            timeControllerMock.addTime(1);
            yield awaitCount(countPerTime);
        }
    });
}

exports.awaitCount = awaitCount;
exports.awaitTime = awaitTime;
