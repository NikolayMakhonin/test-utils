import {
  MatchResult3,
  MatchResult,
  Expected, ExpectedSync, PromiseLikeOrValue,
} from 'src/common/expect/contracts'
import {isPromiseLike} from '@flemist/async-utils'
import {Matcher} from './Matcher'

function createMatchResultError<T>(
  actual: T,
  expected: Expected<T>,
  error: Error,
): MatchResult<T> {
  return {
    actual,
    expected,
    result: null,
    cause : null,
    nested: null,
    error,
  }
}

function createMatchResultBoolean<T>(
  actual: T,
  expected: Expected<T>,
  result: boolean,
): MatchResult<T> {
  return {
    actual,
    expected,
    result,
    cause : null,
    nested: null,
    error : null,
  }
}

function createMatchResultSync<T>(
  actual: T,
  expected: Expected<T>,
  result: MatchResult3,
): MatchResult<T> {
  if (typeof result === 'boolean') {
    return createMatchResultBoolean(actual, expected, result)
  }
  if (typeof result === 'string') {
    return {
      actual,
      expected,
      result: false,
      cause : result,
      nested: null,
      error : null,
    }
  }
  return {
    actual,
    expected,
    result: result.result,
    cause : result.cause,
    nested: result.nested,
    error : null,
  }
}

export function matchSync<T>(actual: T, expected: ExpectedSync<T>): MatchResult<T> {
  try {
    if (expected instanceof Matcher) {
      if (expected.async) {
        const error = new Error('expected matcher is async but should be sync')
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
          const error = new Error('expected matcher is not async but returned a promise')
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
