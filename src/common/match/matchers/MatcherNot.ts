import {Expected, MatchResult3} from '../contracts'
import {matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'

export class MatcherNot<
  T = any,
  Async extends boolean = boolean,
> extends MatcherSyncOrAsync<T, Async> {
  private readonly _expected: Expected<T, Async>

  constructor(async: Async, expected: Expected<T, Async>) {
    super(async)
    this._expected = expected
  }

  async matchAsync(actual: T): Promise<MatchResult3> {
    const nested = await matchAsync<T>(actual, this._expected as Expected<T, true>)
    return {
      result: !nested.result,
      nested: [{
        actualKey   : null,
        result: nested,
      }],
    }
  }

  matchSync(actual: T): MatchResult3 {
    const nested = matchSync(actual, this._expected as Expected<T, false>)
    return {
      result: !nested.result,
      nested: [{
        actualKey   : null,
        result: nested,
      }],
    }
  }

  toString() {
    return `not(${this._expected})`
  }
}
