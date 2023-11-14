'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var common_match_match = require('../match.cjs');
var common_match_MatcherSyncOrAsync = require('../MatcherSyncOrAsync.cjs');
var common_match_helpers = require('../helpers.cjs');
var asyncUtils = require('@flemist/async-utils');
require('../Matcher.cjs');
require('../MatchInternalError.cjs');

class MatcherIterator extends common_match_MatcherSyncOrAsync.MatcherSyncOrAsync {
    constructor(async, expected, options) {
        super(async);
        this._expected = expected;
        this._options = options;
    }
    matchAsync(actual) {
        return tslib.__awaiter(this, void 0, void 0, function* () {
            if (!common_match_helpers.isIterator(actual)) {
                return {
                    result: false,
                    cause: 'is not an iterator',
                };
            }
            let expectedIteratorResultPromise = this._expected.next();
            let actualIteratorResultPromise = actual.next();
            asyncUtils.isPromiseLike(expectedIteratorResultPromise)
                ? yield expectedIteratorResultPromise
                : expectedIteratorResultPromise;
            asyncUtils.isPromiseLike(actualIteratorResultPromise)
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
        if (!common_match_helpers.isIterator(actual)) {
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
            const matchResult = common_match_match.matchSync(actualIteratorResult.value, expectedIteratorResult.value);
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
                                result: common_match_match.createMatchResultSync(void 0, expectedIteratorResult.value, `actual iterator length (${index}) < expected iterator length`),
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
                                result: common_match_match.createMatchResultSync(actualIteratorResult.value, void 0, `actual iterator length > expected iterator length (${index})`),
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

exports.MatcherIterator = MatcherIterator;
