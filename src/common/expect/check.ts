import {Expected} from './contracts'
import {matchSync} from './match'

export type CheckResult<T> = (expected: Expected<T>) => CheckResult<T>

export function check<T>(actual: T): CheckResult<T> {
  return function _check(expected: Expected<T>) {
    const result = matchSync(actual, expected)
    if (result.result === false) {
      throw new Error('check failed')
    }
    return _check
  }
}
