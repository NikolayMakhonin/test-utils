import {MatchArraySetOptions} from './contracts'
import {matchArraySetSimple} from './matchArraySetSimple'
import {matchArraySetOptimized} from './matchArraySetOptimized'
import {isMatcher} from "src/common/match/array/test/helpers";

export function shouldUseOptimized(
  actual: any[],
  expected: any[],
  options: MatchArraySetOptions,
): boolean {
  let matchCountSimple = actual.length * expected.length
  if (matchCountSimple <= 30) {
    return false
  }

  // if (matchCountSimple >= 10000) {
  //   return true
  // }

  let countMatchersActual = 0
  for (let i = 0, len = actual.length; i < len; i++) {
    const actualItem = actual[i]
    if (isMatcher(actualItem)) {
      countMatchersActual++
    }
  }

  let countMatchersExpected = 0
  for (let i = 0, len = expected.length; i < len; i++) {
    const expectedItem = expected[i]
    if (isMatcher(expectedItem)) {
      countMatchersExpected++
    }
  }

  const matchCountOptimized = (actual.length - countMatchersActual) * countMatchersExpected
    + (expected.length - countMatchersExpected) * countMatchersActual
    + countMatchersActual * countMatchersExpected

  if (matchCountSimple >= 2 * matchCountOptimized) {
    return true
  }

  return false
}

export function matchArraySet<T>(
  actual: T[],
  expected: T[],
  isMatcher: (value: any) => boolean,
  match: (actual: T, expected: T) => boolean,
  options: MatchArraySetOptions,
): boolean {
  if (shouldUseOptimized(actual, expected, options)) {
    return matchArraySetOptimized(actual, expected, isMatcher, match, options)
  }

  return matchArraySetSimple(actual, expected, isMatcher, match, options)
}
