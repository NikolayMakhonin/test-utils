function matchMap(actual, expected, match, options) {
    for (const [actualKey, actualValue] of actual) {
        if (expected.has(actualKey)) {
            const expectedValue = expected.get(actualKey);
            if (!match(actualValue, expectedValue)) {
                return false;
            }
        }
        else if (!(options === null || options === void 0 ? void 0 : options.mayNotContained)) {
            return false;
        }
    }
    if (!(options === null || options === void 0 ? void 0 : options.mayNotContains)) {
        for (const [expectedKey] of expected) {
            if (!actual.has(expectedKey)) {
                return false;
            }
        }
    }
    return true;
}

export { matchMap };
