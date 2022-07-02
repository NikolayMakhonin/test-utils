import { __awaiter } from 'tslib';

function awaitCount(timeControllerMock, count) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < count; i++) {
            timeControllerMock.addTime(0);
            yield Promise.resolve();
        }
    });
}
function awaitTime(timeControllerMock, time, countPerTime) {
    return __awaiter(this, void 0, void 0, function* () {
        yield awaitCount(timeControllerMock, countPerTime);
        for (let i = 0; i < time; i++) {
            timeControllerMock.addTime(1);
            yield awaitCount(timeControllerMock, countPerTime);
        }
    });
}

export { awaitCount, awaitTime };
