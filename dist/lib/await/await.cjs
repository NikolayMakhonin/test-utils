'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');

function awaitCount(timeControllerMock, count) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < count; i++) {
            timeControllerMock.addTime(0);
            yield Promise.resolve();
        }
    });
}
function awaitTime(timeControllerMock, time, countPerTime) {
    return tslib.__awaiter(this, void 0, void 0, function* () {
        yield awaitCount(timeControllerMock, countPerTime);
        for (let i = 0; i < time; i++) {
            timeControllerMock.addTime(1);
            yield awaitCount(timeControllerMock, countPerTime);
        }
    });
}

exports.awaitCount = awaitCount;
exports.awaitTime = awaitTime;
