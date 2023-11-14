import { __awaiter } from 'tslib';
import { matchSync, createMatchResultSync } from '../match.mjs';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync.mjs';
import { isIterator } from '../helpers.mjs';
import { isPromiseLike } from '@flemist/async-utils';
import '../Matcher.mjs';
import '../MatchInternalError.mjs';

class MatcherIterator extends MatcherSyncOrAsync {
    constructor(async, expected, options) {
        super(async);
        this._expected = expected;
        this._options = options;
    }
    matchAsync(actual) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isIterator(actual)) {
                return {
                    result: false,
                    cause: 'is not an iterator',
                };
            }
            let expectedIteratorResultPromise = this._expected.next();
            let actualIteratorResultPromise = actual.next();
            isPromiseLike(expectedIteratorResultPromise)
                ? yield expectedIteratorResultPromise
                : expectedIteratorResultPromise;
            isPromiseLike(actualIteratorResultPromise)
                ? yield actualIteratorResultPromise
                : actualIteratorResultPromise;
            // // TODO uncomment this and finish
            // while (true) {
            //   while (true) {
            //     if (actualIteratorResult.done || expectedIteratorResult.done) {
            //       if (!this._options?.canBeDoneBefore && !expectedIteratorResult.done) {
            //         expectedIteratorResultPromise = this._expected.next()
            //         expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
            //           ? await expectedIteratorResultPromise
            //           : expectedIteratorResultPromise
            //
            //         return {
            //           result: false,
            //           cause : `actual iterator (index=${indexActual}) is done before expected iterator (index=${indexExpected})`,
            //           nested: [
            //             {
            //               actualKey   : indexActual,
            //               result: createMatchResultSync(
            //                 void 0,
            //                 expectedIteratorResult.value,
            //                 `actual iterator (index=${indexActual}) is done before expected iterator (index=${indexExpected})`,
            //               ),
            //             },
            //           ],
            //         }
            //       }
            //
            //       if (!this._options?.canBeDoneAfter && !actualIteratorResult.done) {
            //         actualIteratorResultPromise = actual.next()
            //         actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
            //           ? await actualIteratorResultPromise
            //           : actualIteratorResultPromise
            //
            //         return {
            //           result: false,
            //           cause : `actual iterator (index=${indexActual}) is not done when expected iterator (index=${indexExpected}) is done`,
            //           nested: [
            //             {
            //               actualKey   : indexActual,
            //               result: createMatchResultSync(
            //                 actualIteratorResult.value,
            //                 void 0,
            //                 `actual iterator (index=${indexActual}) is not done when expected iterator (index=${indexExpected}) is done`,
            //               ),
            //             },
            //           ],
            //         }
            //       }
            //
            //       return {
            //         result: true,
            //         nested,
            //       }
            //     }
            //
            //     const matchResult = await matchAsync(actualIteratorResult.value, expectedIteratorResult.value)
            //
            //     nested.push({
            //       actualKey   : indexActual,
            //       result: matchResult,
            //     })
            //
            //     if (matchResult.result) {
            //       if (TODO1) {
            //         indexActual++
            //         actualIteratorResultPromise = actual.next()
            //         actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
            //           ? await actualIteratorResultPromise
            //           : actualIteratorResultPromise
            //         continue
            //       }
            //       else if (TODO2) {
            //         indexExpected++
            //         expectedIteratorResultPromise = this._expected.next()
            //         expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
            //           ? await expectedIteratorResultPromise
            //           : expectedIteratorResultPromise
            //         continue
            //       }
            //       else if (TODO3) {
            //         return {
            //           result: false,
            //           nested: [
            //             {
            //               actualKey   : indexActual,
            //               result: matchResult,
            //             },
            //           ],
            //         }
            //       }
            //     }
            //     else if (TODO4) {
            //       indexActual++
            //       actualIteratorResultPromise = actual.next()
            //       actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
            //         ? await actualIteratorResultPromise
            //         : actualIteratorResultPromise
            //       continue
            //     }
            //     else if (TODO5) {
            //       indexExpected++
            //       expectedIteratorResultPromise = this._expected.next()
            //       expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
            //         ? await expectedIteratorResultPromise
            //         : expectedIteratorResultPromise
            //       continue
            //     }
            //     else if (TODO6) {
            //       return {
            //         result: false,
            //         nested: [
            //           {
            //             actualKey   : indexActual,
            //             result: matchResult,
            //           },
            //         ],
            //       }
            //     }
            //
            //     break
            //   }
            //
            //   indexActual++
            //   indexExpected++
            // }
        });
    }
    matchSync(actual) {
        if (!isIterator(actual)) {
            return {
                result: false,
                cause: 'is not an iterator',
            };
        }
        const nested = [];
        let index = 0;
        while (true) {
            let expectedIteratorResult = this._expected.next();
            let actualIteratorResult = actual.next();
            const matchResult = matchSync(actualIteratorResult.value, expectedIteratorResult.value);
            if (!matchResult.result) {
                return {
                    result: false,
                    nested: [
                        {
                            actualKey: index,
                            result: matchResult,
                        },
                    ],
                };
            }
            if (expectedIteratorResult.done || actualIteratorResult.done) {
                if (!expectedIteratorResult.done) {
                    expectedIteratorResult = this._expected.next();
                    return {
                        result: false,
                        cause: `actual iterator length (${index}) < expected iterator length`,
                        nested: [
                            {
                                actualKey: index,
                                result: createMatchResultSync(void 0, expectedIteratorResult.value, `actual iterator length (${index}) < expected iterator length`),
                            },
                        ],
                    };
                }
                if (!actualIteratorResult.done) {
                    actualIteratorResult = actual.next();
                    return {
                        result: false,
                        cause: `actual iterator length > expected iterator length (${index})`,
                        nested: [
                            {
                                actualKey: index,
                                result: createMatchResultSync(actualIteratorResult.value, void 0, `actual iterator length > expected iterator length (${index})`),
                            },
                        ],
                    };
                }
                return {
                    result: true,
                    nested,
                };
            }
            index++;
            nested.push({
                actualKey: index,
                result: matchResult,
            });
        }
    }
    toString() {
        return `TODO`;
    }
}

export { MatcherIterator };
