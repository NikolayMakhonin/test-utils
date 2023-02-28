import {MatchResult3, MatchResultNested, ToExpectedArray} from '../contracts'
import {matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'

export class MatcherArray<
  T extends any[] = any[],
  Async extends boolean = boolean,
> extends MatcherSyncOrAsync<T, Async> {
  private readonly _expected: ToExpectedArray<T, Async>

  constructor(async: Async, expected: ToExpectedArray<T, Async>) {
    super(async)
    this._expected = expected
  }

  async matchAsync(actual: T): Promise<MatchResult3> {
    if (!Array.isArray(actual)) {
      return {
        result: false,
        cause : 'is not an array',
      }
    }

    if (actual.length !== this._expected.length) {
      return {
        result: false,
        cause : `length is not ${this._expected.length}`,
      }
    }

    const nestedTrue: MatchResultNested[] = []
    const nestedFalse: MatchResultNested[] = []

    await Promise.all(this._expected.map(async (expectedItem, i) => {
      const actualItem = actual[i]
      const result = await matchAsync(actualItem, expectedItem)

      if (nestedFalse.length) {
        return
      }

      if (!result.result) {
        nestedFalse.push({
          key: i,
          result,
        })
        return
      }

      nestedTrue.push({
        key: i,
        result,
      })
    }))

    if (nestedFalse.length) {
      return {
        result: false,
        nested: nestedFalse,
      }
    }

    return {
      result: true,
      nested: nestedTrue,
    }
  }

  matchSync(actual: T): MatchResult3 {
    if (!Array.isArray(actual)) {
      return {
        result: false,
        cause : 'is not an array',
      }
    }

    const len = this._expected.length
    if (actual.length !== len) {
      return {
        result: false,
        cause : `length is not ${this._expected.length}`,
      }
    }

    const nestedTrue: MatchResultNested[] = []
    const nestedFalse: MatchResultNested[] = []

    for (let i = 0; i < len; i++) {
      const expectedItem = this._expected[i]
      const actualItem = actual[i]
      const result = matchSync(actualItem, expectedItem)

      if (!result.result) {
        nestedFalse.push({
          key: i,
          result,
        })
        return {
          result: false,
          nested: nestedFalse,
        }
      }

      nestedTrue.push({
        key: i,
        result,
      })
    }

    return {
      result: true,
      nested: nestedTrue,
    }
  }

  toString() {
    return `[${this._expected.map(o => o.toString()).join(', ')}]`
  }
}
