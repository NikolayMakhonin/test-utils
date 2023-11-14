import { __awaiter } from 'tslib';
import { matchAsync, matchSync } from '../match.mjs';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync.mjs';
import '../Matcher.mjs';
import '@flemist/async-utils';
import '../MatchInternalError.mjs';
import '../helpers.mjs';

class MatcherArray extends MatcherSyncOrAsync {
    constructor(async, expected, options) {
        super(async);
        this._expected = expected;
        this._options = options ? Object.assign({}, options) : null;
    }
    matchAsync(actual) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(actual)) {
                return {
                    result: false,
                    cause: 'is not an array',
                };
            }
            if (actual.length !== this._expected.length) {
                return {
                    result: false,
                    cause: `length is not ${this._expected.length}`,
                };
            }
            const nestedTrue = [];
            const nestedFalse = [];
            yield Promise.all(this._expected.map((expectedItem, i) => __awaiter(this, void 0, void 0, function* () {
                const actualItem = actual[i];
                const result = yield matchAsync(actualItem, expectedItem);
                if (nestedFalse.length) {
                    return;
                }
                if (!result.result) {
                    nestedFalse.push({
                        actualKey: i,
                        result,
                    });
                    return;
                }
                nestedTrue.push({
                    actualKey: i,
                    result,
                });
            })));
            if (nestedFalse.length) {
                return {
                    result: false,
                    nested: nestedFalse,
                };
            }
            return {
                result: true,
                nested: nestedTrue,
            };
        });
    }
    matchSync(actual) {
        if (!Array.isArray(actual)) {
            return {
                result: false,
                cause: 'is not an array',
            };
        }
        const len = this._expected.length;
        if (actual.length !== len) {
            return {
                result: false,
                cause: `length is not ${this._expected.length}`,
            };
        }
        const nestedTrue = [];
        const nestedFalse = [];
        for (let i = 0; i < len; i++) {
            const expectedItem = this._expected[i];
            const actualItem = actual[i];
            const result = matchSync(actualItem, expectedItem);
            if (!result.result) {
                nestedFalse.push({
                    actualKey: i,
                    result,
                });
                return {
                    result: false,
                    nested: nestedFalse,
                };
            }
            nestedTrue.push({
                actualKey: i,
                result,
            });
        }
        return {
            result: true,
            nested: nestedTrue,
        };
    }
    toString() {
        return `[${this._expected.map(o => o + '').join(', ')}]`;
    }
}

export { MatcherArray };
