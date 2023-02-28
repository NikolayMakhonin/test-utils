import {MatchResult3, MatchResultNested, ToExpectedDeep} from '../contracts'
import {matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'
import {Matcher} from '../Matcher'
import {MatcherObject} from './MatcherObject'
import {MatcherArray} from './MatcherArray'

export class MatcherDeep<
  T = any,
  Async extends boolean = boolean,
> extends MatcherSyncOrAsync<T, Async> {
  private readonly _expected: ToExpectedDeep<T, Async>

  constructor(async: Async, expected: ToExpectedDeep<T, Async>) {
    super(async)
    if (expected != null && !(expected instanceof Matcher)) {
      if (typeof expected === 'object') {
        expected = new MatcherObject<any, Async>(async, expected) as any
      }
      else if (Array.isArray(expected)) {
        expected = new MatcherArray<any, Async>(async, expected) as any
      }
    }
    this._expected = expected
  }

  async matchAsync(actual: T): Promise<MatchResult3> {
    if (actual === null || typeof actual !== 'object') {
      return {
        result: false,
        cause : 'is not an object',
      }
    }

    const actualKeys = Object.keys(actual)
    for (const key of actualKeys) {
      if (!Object.prototype.hasOwnProperty.call(this._expected, key)) {
        return {
          result: false,
          cause : `has unexpected key '${key}'`,
        }
      }
    }

    const nestedTrue: MatchResultNested[] = []
    const nestedFalse: MatchResultNested[] = []

    await Promise.all(Object.keys(this._expected).map(async (key) => {
      const expectedItem = this._expected[key]
      const actualItem = actual[key]
      const result = await matchAsync(actualItem, expectedItem)

      if (nestedFalse.length) {
        return
      }

      if (!result.result) {
        nestedFalse.push({
          key,
          result,
        })
        return
      }

      nestedTrue.push({
        key,
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
    if (actual === null || typeof actual !== 'object') {
      return {
        result: false,
        cause : 'is not an object',
      }
    }

    const actualKeys = Object.keys(actual)
    for (const key of actualKeys) {
      if (!Object.prototype.hasOwnProperty.call(this._expected, key)) {
        return {
          result: false,
          cause : `has unexpected key '${key}'`,
        }
      }
    }

    const nestedTrue: MatchResultNested[] = []
    const nestedFalse: MatchResultNested[] = []

    for (const key of Object.keys(this._expected)) {
      if (Object.prototype.hasOwnProperty.call(this._expected, key)) {
        const expectedItem = this._expected[key]
        const actualItem = actual[key]
        const result = matchSync(actualItem, expectedItem)

        if (!result.result) {
          nestedFalse.push({
            key,
            result,
          })
          return {
            result: false,
            nested: nestedFalse,
          }
        }

        nestedTrue.push({
          key,
          result,
        })
      }
    }

    return {
      result: true,
      nested: nestedTrue,
    }
  }

  toString() {
    if (this._expected instanceof Matcher) {
      return this._expected.toString()
    }
    return JSON.stringify(this._expected, null, 2)
  }
}
