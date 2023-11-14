import { matchArraySetSimple } from './matchArraySetSimple.mjs';
import { matchArraySetOptimized } from './matchArraySetOptimized.mjs';

function shouldUseOptimized(actual, expected, isMatcher, options) {
    const matchCountSimple = actual.length * expected.length;
    if (matchCountSimple <= 30) {
        return false;
    }
    // if (matchCountSimple >= 10000) {
    //   return true
    // }
    let countMatchersActual = 0;
    for (let i = 0, len = actual.length; i < len; i++) {
        const actualItem = actual[i];
        if (isMatcher(actualItem)) {
            countMatchersActual++;
        }
    }
    let countMatchersExpected = 0;
    for (let i = 0, len = expected.length; i < len; i++) {
        const expectedItem = expected[i];
        if (isMatcher(expectedItem)) {
            countMatchersExpected++;
        }
    }
    const matchCountOptimized = (actual.length - countMatchersActual) * countMatchersExpected
        + (expected.length - countMatchersExpected) * countMatchersActual
        + countMatchersActual * countMatchersExpected;
    if (matchCountSimple >= 2 * matchCountOptimized) {
        return true;
    }
    return false;
}
function matchArraySet(actual, expected, isMatcher, match, options) {
    if (shouldUseOptimized(actual, expected, isMatcher)) {
        return matchArraySetOptimized(actual, expected, isMatcher, match, options);
    }
    return matchArraySetSimple(actual, expected, isMatcher, match, options);
}

export { matchArraySet, shouldUseOptimized };
