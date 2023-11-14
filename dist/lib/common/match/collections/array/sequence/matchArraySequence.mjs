import { UNSET } from '../../../contracts.mjs';

function matchArraySequence(actual, expected, isMatcher, match, options) {
    if (((options === null || options === void 0 ? void 0 : options.actualMayNotStartWith) || (options === null || options === void 0 ? void 0 : options.actualMayNotEndWith))
        && ((options === null || options === void 0 ? void 0 : options.expectedMayNotStartWith) || (options === null || options === void 0 ? void 0 : options.expectedMayNotEndWith))) {
        throw new Error(`You can't use both actualMayNotStartWith(${options === null || options === void 0 ? void 0 : options.actualMayNotStartWith})/actualMayNotEndWith(${options === null || options === void 0 ? void 0 : options.actualMayNotEndWith}) and expectedMayNotStartWith(${options === null || options === void 0 ? void 0 : options.expectedMayNotStartWith})/expectedMayNotEndWith(${options === null || options === void 0 ? void 0 : options.expectedMayNotEndWith})`);
    }
    let indexActualStart = 0;
    let indexExpectedStart = 0;
    let indexActual = 0;
    let indexExpected = 0;
    let lastIncrementActual = false;
    let lastIncrementExpected = false;
    let hasAtLeastOneMatch = false;
    const nestedTrue = [];
    let nestedFalse;
    let nestedTrueMaxLength = -1;
    while (true) {
        if (indexActual >= actual.length || indexExpected >= expected.length) {
            if (indexExpected >= expected.length && (options === null || options === void 0 ? void 0 : options.actualMayNotEndWith)) {
                return {
                    result: true,
                    nested: nestedTrue,
                };
            }
            if (indexActual >= actual.length && (options === null || options === void 0 ? void 0 : options.expectedMayNotEndWith)) {
                return {
                    result: true,
                    nested: nestedTrue,
                };
            }
            if (lastIncrementActual && !lastIncrementExpected) {
                indexExpected++;
                lastIncrementExpected = true;
                continue;
            }
            if (hasAtLeastOneMatch && indexActual < actual.length && !(options === null || options === void 0 ? void 0 : options.actualMayNotEndWith) && (options === null || options === void 0 ? void 0 : options.breaks)) {
                indexActual = actual.length - 1;
                indexExpected = expected.length - 1;
                lastIncrementActual = true;
                lastIncrementExpected = true;
                continue;
            }
            if (indexActual < actual.length && (options === null || options === void 0 ? void 0 : options.actualMayNotStartWith)) {
                indexActualStart++;
                indexActual = indexActualStart;
                indexExpected = indexExpectedStart;
                lastIncrementActual = false;
                lastIncrementExpected = false;
                continue;
            }
            if (indexExpected < expected.length && (options === null || options === void 0 ? void 0 : options.expectedMayNotStartWith)) {
                indexExpectedStart++;
                indexActual = indexActualStart;
                indexExpected = indexExpectedStart;
                lastIncrementActual = false;
                lastIncrementExpected = false;
                continue;
            }
            if (indexExpected < expected.length && !(options === null || options === void 0 ? void 0 : options.expectedMayNotEndWith)) {
                return {
                    result: false,
                    nested: [nestedFalse || {
                            actualKey: indexActual,
                            expectedKey: indexExpected,
                            result: {
                                actual: actual[indexActual],
                                expected: UNSET,
                                result: false,
                                cause: null,
                                nested: null,
                                error: null,
                            },
                        }],
                };
            }
            if (indexActual < actual.length) {
                return {
                    result: false,
                    nested: [nestedFalse || {
                            actualKey: indexActual,
                            expectedKey: indexExpected,
                            result: {
                                actual: UNSET,
                                expected: expected[indexExpected],
                                result: false,
                                cause: null,
                                nested: null,
                                error: null,
                            },
                        }],
                };
            }
            return {
                result: true,
                nested: nestedTrue,
            };
        }
        const actualItem = actual[indexActual];
        const expectedItem = expected[indexExpected];
        const matchResult = match(actualItem, expectedItem);
        if (matchResult.result) {
            nestedTrue.push({
                actualKey: indexActual,
                expectedKey: indexExpected,
                result: matchResult,
            });
            hasAtLeastOneMatch = true;
            if ((options === null || options === void 0 ? void 0 : options.repeats) && (!(options === null || options === void 0 ? void 0 : options.breaks) || indexActual >= actual.length - 2)) {
                indexActual++;
                lastIncrementActual = true;
                lastIncrementExpected = false;
            }
            else {
                indexActual++;
                indexExpected++;
            }
        }
        else {
            if (nestedTrue.length > nestedTrueMaxLength) {
                nestedTrueMaxLength = nestedTrue.length;
                nestedFalse = {
                    actualKey: indexActual,
                    expectedKey: indexExpected,
                    result: matchResult,
                };
            }
            if ((options === null || options === void 0 ? void 0 : options.breaks) && indexActual > 0 && indexActual < actual.length - 1) {
                indexActual++;
                continue;
            }
            if (lastIncrementActual && !lastIncrementExpected) {
                indexExpected++;
                lastIncrementExpected = true;
            }
            else if (options === null || options === void 0 ? void 0 : options.actualMayNotStartWith) {
                indexActualStart++;
                indexActual = indexActualStart;
                indexExpected = indexExpectedStart;
            }
            else if ((options === null || options === void 0 ? void 0 : options.expectedMayNotStartWith) && indexExpectedStart < expected.length) {
                indexExpectedStart++;
                indexActual = indexActualStart;
                indexExpected = indexExpectedStart;
            }
            else {
                return {
                    result: false,
                    nested: [nestedFalse],
                };
            }
        }
    }
}

export { matchArraySequence };
