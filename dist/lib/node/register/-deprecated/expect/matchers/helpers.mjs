function expectEquals(receiver, expected) {
    if (receiver === expected) {
        return true;
    }
    if (expected && typeof expected.asymmetricMatch === 'function') {
        return expected.asymmetricMatch(receiver);
    }
    return false;
}
function expectedToString(expected) {
    if (typeof expected.toAsymmetricMatcher === 'function') {
        return expected.toAsymmetricMatcher();
    }
    return expected + '';
}

export { expectEquals, expectedToString };
