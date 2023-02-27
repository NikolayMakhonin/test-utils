import {Matcher} from './Matcher'
import {MatchResult3, PromiseLikeOrValue} from './contracts'

export abstract class MatcherSyncOrAsync<
  T = any,
  Async extends boolean = boolean,
> extends Matcher<T, Async> {
  protected constructor(async: Async) {
    super()
    this._async = async || false as any
  }

  private readonly _async: Async
  get async() {
    return this._async
  }

  abstract matchSync(actual: T): MatchResult3

  abstract matchAsync(actual: T): PromiseLikeOrValue<MatchResult3>

  match(actual: T) {
    if (this.async) {
      return this.matchAsync(actual) as any
    }
    return this.matchSync(actual)
  }
}
