import {MatchResult3, MatchResultNested, TIterator, ToExpectedIterator} from '../contracts'
import {createMatchResultSync, matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'
import {isIterator} from '../helpers'
import {isPromiseLike} from '@flemist/async-utils'

export type MatcherIteratorOptions = {
  contains?: boolean
  contained?: boolean
}

export class MatcherIterator<
  T extends TIterator<any, Async>,
  Async extends boolean = boolean,
> extends MatcherSyncOrAsync<T, Async> {
  private readonly _expected: ToExpectedIterator<T, Async>
  private readonly _options: MatcherIteratorOptions

  constructor(async: Async, expected: ToExpectedIterator<T, Async>, options?: MatcherIteratorOptions) {
    super(async)
    this._expected = expected
    this._options = options
  }

  async matchAsync(actual: T): Promise<MatchResult3> {
    if (!isIterator(actual)) {
      return {
        result: false,
        cause : 'is not an iterator',
      }
    }

    const nested: MatchResultNested[] = []

    let index = 0

    while (true) {
      let expectedIteratorResultPromise = this._expected.next()
      let actualIteratorResultPromise = actual.next()
      let expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
        ? await expectedIteratorResultPromise
        : expectedIteratorResultPromise
      let actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
        ? await actualIteratorResultPromise
        : actualIteratorResultPromise

      const matchResult = await matchAsync(actualIteratorResult.value, expectedIteratorResult.value)

      if (!matchResult.result) {
        return {
          result: false,
          nested: [
            {
              key   : index,
              result: matchResult,
            },
          ],
        }
      }

      if (expectedIteratorResult.done || actualIteratorResult.done) {
        if (!expectedIteratorResult.done) {
          expectedIteratorResultPromise = this._expected.next()
          expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
            ? await expectedIteratorResultPromise
            : expectedIteratorResultPromise

          return {
            result: false,
            cause : `actual iterator length (${index}) < expected iterator length`,
            nested: [
              {
                key   : index,
                result: createMatchResultSync(
                  void 0,
                  expectedIteratorResult.value,
                  `actual iterator length (${index}) < expected iterator length`,
                ),
              },
            ],
          }
        }

        if (!actualIteratorResult.done) {
          actualIteratorResultPromise = actual.next()
          actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
            ? await actualIteratorResultPromise
            : actualIteratorResultPromise

          return {
            result: false,
            cause : `actual iterator length > expected iterator length (${index})`,
            nested: [
              {
                key   : index,
                result: createMatchResultSync(
                  actualIteratorResult.value,
                  void 0,
                  `actual iterator length > expected iterator length (${index})`,
                ),
              },
            ],
          }
        }

        return {
          result: true,
          nested,
        }
      }

      index++

      nested.push({
        key   : index,
        result: matchResult,
      })
    }
  }

  matchSync(actual: T): MatchResult3 {
    if (!isIterator(actual)) {
      return {
        result: false,
        cause : 'is not an iterator',
      }
    }

    const nested: MatchResultNested[] = []

    let index = 0

    while (true) {
      let expectedIteratorResult = this._expected.next() as IteratorResult<any>
      let actualIteratorResult = actual.next()

      const matchResult = matchSync(actualIteratorResult.value, expectedIteratorResult.value)

      if (!matchResult.result) {
        return {
          result: false,
          nested: [
            {
              key   : index,
              result: matchResult,
            },
          ],
        }
      }

      if (expectedIteratorResult.done || actualIteratorResult.done) {
        if (!expectedIteratorResult.done) {
          expectedIteratorResult = this._expected.next() as IteratorResult<any>

          return {
            result: false,
            cause : `actual iterator length (${index}) < expected iterator length`,
            nested: [
              {
                key   : index,
                result: createMatchResultSync(
                  void 0,
                  expectedIteratorResult.value,
                  `actual iterator length (${index}) < expected iterator length`,
                ),
              },
            ],
          }
        }

        if (!actualIteratorResult.done) {
          actualIteratorResult = actual.next()

          return {
            result: false,
            cause : `actual iterator length > expected iterator length (${index})`,
            nested: [
              {
                key   : index,
                result: createMatchResultSync(
                  actualIteratorResult.value,
                  void 0,
                  `actual iterator length > expected iterator length (${index})`,
                ),
              },
            ],
          }
        }

        return {
          result: true,
          nested,
        }
      }

      index++

      nested.push({
        key   : index,
        result: matchResult,
      })
    }
  }

  toString() {
    return `TODO`
  }
}
