import {Expected} from './contracts'
import {Matcher} from './Matcher'

export function isIterator(obj: any): obj is Iterator<any> {
  return obj && typeof obj.next === 'function'
}

export function isIterable(obj: any): obj is Iterable<any> {
  return obj && typeof obj[Symbol.iterator] === 'function'
}

export function isSyncMatcher<T>(expected: Expected<T>): expected is Matcher<T, false> {
  return expected instanceof Matcher && expected.async === false
}
