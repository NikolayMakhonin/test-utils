import { __awaiter } from 'tslib';

function awaitCount(count) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < count; i++) {
            yield Promise.resolve();
        }
    });
}
function awaitTime(timeControllerMock, time, countPerTime) {
    return __awaiter(this, void 0, void 0, function* () {
        yield awaitCount(countPerTime);
        for (let i = 0; i < time; i++) {
            timeControllerMock.addTime(1);
            yield awaitCount(countPerTime);
        }
    });
}

export { awaitCount, awaitTime };
