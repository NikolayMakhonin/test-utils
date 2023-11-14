'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function matchArraySetSimple(actual, expected, isMatcher, match, options) {
    if ((options === null || options === void 0 ? void 0 : options.mayNotContains) && (options === null || options === void 0 ? void 0 : options.mayNotContained)) {
        throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`);
    }
    const actualValues = actual.slice();
    const expectedValues = expected.slice();
    const actualFound = [];
    const expectedFound = [];
    if (!(options === null || options === void 0 ? void 0 : options.mayNotContains)) {
        let actualIndex = 0;
        while (actualIndex < actualValues.length) {
            const actualItem = actualValues[actualIndex];
            let found = false;
            let expectedIndex = 0;
            while (expectedIndex < expectedValues.length) {
                const expectedItem = expectedValues[expectedIndex];
                const matchResult = match(actualItem, expectedItem);
                if (matchResult.result) {
                    expectedValues[expectedIndex] = expectedValues[expectedValues.length - 1];
                    expectedValues.length--;
                    actualValues[actualIndex] = actualValues[actualValues.length - 1];
                    actualValues.length--;
                    actualFound.push(actualItem);
                    expectedFound.push(expectedItem);
                    found = true;
                    break;
                }
                else {
                    expectedIndex++;
                }
            }
            if (!found) {
                actualIndex++;
            }
        }
    }
    if (!(options === null || options === void 0 ? void 0 : options.mayNotContained)) {
        let expectedIndex = 0;
        while (expectedIndex < expectedValues.length) {
            const expectedItem = expectedValues[expectedIndex];
            let found = false;
            let actualIndex = 0;
            while (actualIndex < actualValues.length) {
                const actualItem = actualValues[actualIndex];
                const matchResult = match(actualItem, expectedItem);
                if (matchResult.result) {
                    actualValues[actualIndex] = actualValues[actualValues.length - 1];
                    actualValues.length--;
                    expectedValues[expectedIndex] = expectedValues[expectedValues.length - 1];
                    expectedValues.length--;
                    actualFound.push(actualItem);
                    expectedFound.push(expectedItem);
                    found = true;
                    break;
                }
                else {
                    actualIndex++;
                }
            }
            if (!found) {
                expectedIndex++;
            }
        }
    }
    if (actualValues.length > 0) {
        if (options === null || options === void 0 ? void 0 : options.mayNotContained) {
            return {
                result: true,
                nested: null,
            };
        }
        if (options === null || options === void 0 ? void 0 : options.actualRepeats) {
            for (let actualIndex = 0, len = actualValues.length; actualIndex < len; actualIndex++) {
                const actualItem = actualValues[actualIndex];
                let found = false;
                for (let expectedIndex = 0, len = expectedFound.length; expectedIndex < len; expectedIndex++) {
                    const expectedItem = expectedFound[expectedIndex];
                    const matchResult = match(actualItem, expectedItem);
                    if (matchResult.result) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return {
                        result: false,
                        nested: null,
                    };
                }
                actualIndex++;
            }
        }
        else {
            return {
                result: false,
                nested: null,
            };
        }
    }
    if (expectedValues.length > 0) {
        if (options === null || options === void 0 ? void 0 : options.mayNotContains) {
            return {
                result: true,
                nested: null,
            };
        }
        if (options === null || options === void 0 ? void 0 : options.expectedRepeats) {
            for (let expectedIndex = 0, len = expectedValues.length; expectedIndex < len; expectedIndex++) {
                const expectedItem = expectedValues[expectedIndex];
                let found = false;
                for (let actualIndex = 0, len = actualFound.length; actualIndex < len; actualIndex++) {
                    const actualItem = actualFound[actualIndex];
                    const matchResult = match(actualItem, expectedItem);
                    if (matchResult.result) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return {
                        result: false,
                        nested: null,
                    };
                }
                expectedIndex++;
            }
        }
        else {
            return {
                result: false,
                nested: null,
            };
        }
    }
    return {
        result: true,
        nested: null,
    };
}

exports.matchArraySetSimple = matchArraySetSimple;
