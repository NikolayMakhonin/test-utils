import {MatchResult3, MatchResultNested, ToExpectedArray} from '../contracts'
import {matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'

export type MatcherArrayOptions = {
  contains?: boolean
  contained?: boolean
}

export class MatcherArray<
  T extends any[] = any[],
  Async extends boolean = boolean,
> extends MatcherSyncOrAsync<T, Async> {
  private readonly _expected: ToExpectedArray<T, Async>
  private readonly _options: MatcherArrayOptions

  constructor(async: Async, expected: ToExpectedArray<T, Async>, options?: MatcherArrayOptions) {
    super(async)
    this._expected = expected
    this._options = options ? {...options} : null
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
          actualKey: i,
          result,
        })
        return
      }

      nestedTrue.push({
        actualKey: i,
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
          actualKey: i,
          result,
        })
        return {
          result: false,
          nested: nestedFalse,
        }
      }

      nestedTrue.push({
        actualKey: i,
        result,
      })
    }

    return {
      result: true,
      nested: nestedTrue,
    }
  }

  toString() {
    return `[${this._expected.map(o => o + '').join(', ')}]`
  }
}
