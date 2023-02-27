import {MatchResult, PromiseLikeOrValue} from './contracts'
import {isPromiseLike} from '@flemist/async-utils'

function throwError<T>(matchResult: MatchResult<T>): never {
  throw new Error('check failed') // TODO: implement error message builder
}

export function checkSync<T>(matchResult: MatchResult<T>): void {
  if (matchResult.result === false) {
    throwError(matchResult)
  }
}

export async function checkAsync<T>(matchResultAsync: PromiseLikeOrValue<MatchResult<T>>) {
  const matchResult = await matchResultAsync
  if (matchResult.result === false) {
    throwError(matchResult)
  }
}

export function check<T>(matchResult: MatchResult<T>): void
export function check<T>(matchResult: PromiseLike<MatchResult<T>>): PromiseLikeOrValue<void>
export function check<T>(matchResult: PromiseLikeOrValue<MatchResult<T>>) {
  if (isPromiseLike(matchResult)) {
    return checkAsync(matchResult)
  }
  checkSync(matchResult)
}
