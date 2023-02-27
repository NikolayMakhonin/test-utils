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

  async matchAsync(actual: any): Promise<MatchResult3> {
    const nested = await matchAsync(actual, this._expected)
    return {
      result: !nested.result,
      nested: [{
        key   : null,
        result: nested,
      }],
    }
  }

  matchSync(actual: any) {
    const nested = matchSync(actual, this._expected)
    return {
      result: !nested.result,
      nested: [{
        key   : null,
        result: nested,
      }],
    }
  }

  toString() {
    return `not(${this._expected})`
  }
}
