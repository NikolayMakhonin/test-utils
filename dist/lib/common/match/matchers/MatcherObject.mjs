import { __awaiter } from 'tslib';
import { matchAsync, matchSync } from '../match.mjs';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync.mjs';
import '../Matcher.mjs';
import '@flemist/async-utils';
import '../MatchInternalError.mjs';
import '../helpers.mjs';

class MatcherObject extends MatcherSyncOrAsync {
    constructor(async, expected, options) {
        super(async);
        this._expected = expected;
        this._options = options ? Object.assign({}, options) : null;
    }
    matchAsync(actual) {
        return __awaiter(this, void 0, void 0, function* () {
            if (actual === null || typeof actual !== 'object') {
                return {
                    result: false,
                    cause: 'is not an object',
                };
            }
            const actualKeys = Object.keys(actual);
            for (const key of actualKeys) {
                if (!Object.prototype.hasOwnProperty.call(this._expected, key)) {
                    return {
                        result: false,
                        cause: `has unexpected key '${key}'`,
                    };
                }
            }
            const nestedTrue = [];
            const nestedFalse = [];
            yield Promise.all(Object.keys(this._expected).map((key) => __awaiter(this, void 0, void 0, function* () {
                const expectedItem = this._expected[key];
                const actualItem = actual[key];
                const result = yield matchAsync(actualItem, expectedItem);
                if (nestedFalse.length) {
                    return;
                }
                if (!result.result) {
                    nestedFalse.push({
                        actualKey: key,
                        result,
                    });
                    return;
                }
                nestedTrue.push({
                    actualKey: key,
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
        if (actual === null || typeof actual !== 'object') {
            return {
                result: false,
                cause: 'is not an object',
            };
        }
        const actualKeys = Object.keys(actual);
        for (const key of actualKeys) {
            if (!Object.prototype.hasOwnProperty.call(this._expected, key)) {
                return {
                    result: false,
                    cause: `has unexpected key '${key}'`,
                };
            }
        }
        const nestedTrue = [];
        const nestedFalse = [];
        for (const key of Object.keys(this._expected)) {
            if (Object.prototype.hasOwnProperty.call(this._expected, key)) {
                const expectedItem = this._expected[key];
                const actualItem = actual[key];
                const result = matchSync(actualItem, expectedItem);
                if (!result.result) {
                    nestedFalse.push({
                        actualKey: key,
                        result,
                    });
                    return {
                        result: false,
                        nested: nestedFalse,
                    };
                }
                nestedTrue.push({
                    actualKey: key,
                    result,
                });
            }
        }
        return {
            result: true,
            nested: nestedTrue,
        };
    }
    toString() {
        return `{${Object.keys(this._expected).map((key) => {
            return `${key}: ${this._expected[key]}`;
        }).join(', ')}}`;
    }
}

export { MatcherObject };
