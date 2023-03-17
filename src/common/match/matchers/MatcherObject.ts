import {MatchResult3, MatchResultNested, ToExpectedObject} from '../contracts'
import {matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'

export type MatcherObjectOptions = {
  containing?: boolean
  ordered?: boolean
}

export class MatcherObject<
  T extends object = any,
  Async extends boolean = boolean,
> extends MatcherSyncOrAsync<T, Async> {
  private readonly _expected: ToExpectedObject<T, Async>
  private readonly _options: MatcherObjectOptions

  constructor(async: Async, expected: ToExpectedObject<T, Async>, options?: MatcherObjectOptions) {
    super(async)
    this._expected = expected
    this._options = options ? {...options} : null
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
          actualKey: key,
          result,
        })
        return
      }

      nestedTrue.push({
        actualKey: key,
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
            actualKey: key,
            result,
          })
          return {
            result: false,
            nested: nestedFalse,
          }
        }

        nestedTrue.push({
          actualKey: key,
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
    return `{${Object.keys(this._expected).map((key) => {
      return `${key}: ${this._expected[key]}`
    }).join(', ')}}`
  }
}
