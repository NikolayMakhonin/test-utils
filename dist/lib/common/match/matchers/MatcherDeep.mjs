import { __awaiter } from 'tslib';
import { matchAsync, matchSync } from '../match.mjs';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync.mjs';
import { Matcher } from '../Matcher.mjs';
import { MatcherObject } from './MatcherObject.mjs';
import { MatcherArray } from './MatcherArray.mjs';
import '@flemist/async-utils';
import '../MatchInternalError.mjs';
import '../helpers.mjs';

class MatcherDeep extends MatcherSyncOrAsync {
    constructor(async, expected, options) {
        super(async);
        if (expected != null && !(expected instanceof Matcher)) {
            if (typeof expected === 'object') {
                expected = new MatcherObject(async, expected, options === null || options === void 0 ? void 0 : options.object);
            }
            else if (Array.isArray(expected)) {
                expected = new MatcherArray(async, expected, options === null || options === void 0 ? void 0 : options.array);
            }
        }
        this._expected = expected;
        this._options = options ? Object.assign(Object.assign({}, options), { object: options.object ? Object.assign({}, options.object) : null, array: options.array ? Object.assign({}, options.array) : null }) : null;
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
        if (this._expected instanceof Matcher) {
            return this._expected.toString();
        }
        return JSON.stringify(this._expected, null, 2);
    }
}

export { MatcherDeep };
