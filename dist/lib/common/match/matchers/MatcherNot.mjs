import { __awaiter } from 'tslib';
import { matchAsync, matchSync } from '../match.mjs';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync.mjs';
import '../Matcher.mjs';
import '@flemist/async-utils';
import '../MatchInternalError.mjs';
import '../helpers.mjs';

class MatcherNot extends MatcherSyncOrAsync {
    constructor(async, expected) {
        super(async);
        this._expected = expected;
    }
    matchAsync(actual) {
        return __awaiter(this, void 0, void 0, function* () {
            const nested = yield matchAsync(actual, this._expected);
            return {
                result: !nested.result,
                nested: [{
                        actualKey: null,
                        result: nested,
                    }],
            };
        });
    }
    matchSync(actual) {
        const nested = matchSync(actual, this._expected);
        return {
            result: !nested.result,
            nested: [{
                    actualKey: null,
                    result: nested,
                }],
        };
    }
    toString() {
        return `not(${this._expected})`;
    }
}

export { MatcherNot };
