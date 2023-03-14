import type {Expected, ExpectedSync, MatchResult, MatchResult3, PromiseLikeOrValue} from './contracts'
import {Matcher} from './Matcher'
import {isPromiseLike} from '@flemist/async-utils'
import {MatchInternalError} from './MatchInternalError'
import {isSyncMatcher} from './helpers'

function validateMatchResult<T>(_result: MatchResult<T>): MatchResult<T> {
  const {
    result,
    cause,
    nested,
    error,
  } = _result

  if (error) {
    if (!(error instanceof Error)) {
      throw new MatchInternalError(`error must be an instance of Error, but it is: ${error}`)
    }
    if (result != null) {
      throw new MatchInternalError(`result must be null if error is set, but it is: ${result}`)
    }
    if (cause != null) {
      throw new MatchInternalError(`cause must be null if error is set, but it is: ${cause}`)
    }
    if (nested != null) {
      throw new MatchInternalError(`nested must be null if error is set, but it is: ${nested}`)
    }
    return _result
  }

  if (typeof result !== 'boolean') {
    throw new MatchInternalError(`result must be a boolean, but it is: ${result}`)
  }
  if (typeof cause !== 'string' && cause != null) {
    throw new MatchInternalError(`cause must be a string or null, but it is: ${cause}`)
  }
  if (nested != null && !(nested instanceof Array)) {
    throw new MatchInternalError(`nested must be an array or null, but it is: ${nested}`)
  }

  return _result
}

function createMatchResultError<T>(
  actual: T,
  expected: Expected<T>,
  error: Error,
): MatchResult<T> {
  return validateMatchResult({
    actual,
    expected,
    result: null,
    cause : null,
    nested: null,
    error,
  })
}

function createMatchResultBoolean<T>(
  actual: T,
  expected: Expected<T>,
  result: boolean,
): MatchResult<T> {
  return validateMatchResult({
    actual,
    expected,
    result,
    cause : null,
    nested: null,
    error : null,
  })
}

export function createMatchResultSync<T>(
  actual: T,
  expected: Expected<T>,
  result: MatchResult3,
): MatchResult<T> {
  if (typeof result === 'boolean') {
    return createMatchResultBoolean(actual, expected, result)
  }
  if (typeof result === 'string') {
    return validateMatchResult({
      actual,
      expected,
      result: false,
      cause : result,
      nested: null,
      error : null,
    })
  }
  return validateMatchResult({
    actual,
    expected,
    result: result.result,
    cause : result.cause,
    nested: result.nested,
    error : null,
  })
}

export function matchSync<T>(actual: T, expected: ExpectedSync<T>): MatchResult<T> {
  try {
    if (expected instanceof Matcher) {
      if (expected.async) {
        const error = new MatchInternalError('expected matcher is async but should be sync')
        return createMatchResultError(actual, expected, error)
      }
      const result = expected.match(actual)
      return createMatchResultSync(actual, expected, result)
    }
    return createMatchResultBoolean(actual, expected, actual === expected)
  }
  catch (error) {
    return createMatchResultError(actual, expected, error)
  }
}

async function createMatchResultAsync<T>(
  actual: T,
  expected: Expected<T>,
  result: PromiseLikeOrValue<MatchResult3>,
): Promise<MatchResult<T>> {
  try {
    const resultValue = await result
    return createMatchResultSync(actual, expected, resultValue)
  }
  catch (error) {
    return createMatchResultError(actual, expected, error)
  }
}

export function matchAsync<T>(actual: T, expected: Expected<T>): PromiseLikeOrValue<MatchResult<T>> {
  try {
    if (expected instanceof Matcher) {
      const result = expected.match(actual)
      if (isPromiseLike(result)) {
        if (!expected.async) {
          const error = new MatchInternalError('expected matcher is not async but returned a promise')
          return createMatchResultError(actual, expected, error)
        }
        return createMatchResultAsync(actual, expected, result)
      }
      return createMatchResultSync(actual, expected, result)
    }
    return createMatchResultBoolean(actual, expected, actual === expected)
  }
  catch (error) {
    return createMatchResultError(actual, expected, error)
  }
}

export function match<T>(actual: T, expected: Expected<T, false>): MatchResult<T>
export function match<T>(actual: T, expected: Expected<T, true>): PromiseLikeOrValue<MatchResult<T>>
export function match<T>(actual: T, expected: Expected<T>): PromiseLikeOrValue<MatchResult<T>> {
  return isSyncMatcher(expected)
    ? matchSync(actual, expected)
    : matchAsync(actual, expected)
}
