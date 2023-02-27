import {MatcherCheck} from 'src/common/expect/contracts'
import {Matcher} from "src/common/expect/Matcher";

export function matcher<T>(
  check: MatcherCheck<T>,
  _toString: string | (() => string),
): Matcher<T> {
  function matcherCheck(actual: T): boolean {
    return check(actual)
  }

  matcherCheck.toString = function toString() {
    return typeof _toString === 'function'
      ? _toString()
      : _toString
  }

  Object.defineProperty(matcherCheck, 'name', {
    value: check.name,
  })

  return matcherCheck
}

export function isEqualTo<T>(expected: T): Matcher<T> {
  return (actual: T) => {
    return actual === expected
  }
}
