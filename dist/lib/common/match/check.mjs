import { __awaiter } from 'tslib';
import { isPromiseLike } from '@flemist/async-utils';

function throwError(matchResult) {
    throw new Error('check failed'); // TODO: implement error message builder
}
function checkSync(matchResult) {
    if (matchResult.result === false) {
        throwError();
    }
}
function checkAsync(matchResultAsync) {
    return __awaiter(this, void 0, void 0, function* () {
        const matchResult = yield matchResultAsync;
        if (matchResult.result === false) {
            throwError();
        }
    });
}
function check(matchResult) {
    if (isPromiseLike(matchResult)) {
        return checkAsync(matchResult);
    }
    checkSync(matchResult);
}

export { check, checkAsync, checkSync };
