import { Matcher } from './Matcher.mjs';

function isIterator(obj) {
    return obj && typeof obj.next === 'function';
}
function isIterable(obj) {
    return obj && typeof obj[Symbol.iterator] === 'function';
}
function isSyncMatcher(expected) {
    return expected instanceof Matcher && expected.async === false;
}

export { isIterable, isIterator, isSyncMatcher };
