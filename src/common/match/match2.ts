import {ExpectedAsync, ExpectedSync, MatchResult, PromiseLikeOrValue} from './contracts'
import {matchAsync, matchSync} from './match'

export function match<T>(actual: T) {
  function _matchSync(expected: ExpectedSync<T>): MatchResult<T> {
    return matchSync(actual, expected)
  }

  _matchSync.async = function _matchAsync(expected: ExpectedAsync<T>): PromiseLikeOrValue<MatchResult<T>> {
    return matchAsync(actual, expected)
  }

  return _matchSync
}

// match(1)(1)
