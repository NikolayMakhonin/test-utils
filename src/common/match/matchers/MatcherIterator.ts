import {MatchResult3, MatchResultNested, TIterator, ToExpectedIterator} from '../contracts'
import {createMatchResultSync, matchAsync, matchSync} from '../match'
import {MatcherSyncOrAsync} from '../MatcherSyncOrAsync'
import {isIterator} from '../helpers'
import {isPromiseLike} from '@flemist/async-utils'

export type MatcherIteratorOptions = {
  canBeDoneBefore?: boolean
  canBeDoneAfter?: boolean
  actualDuplicatesRange?: [min: number | null, max: number | null]
  expectedDuplicatesRange?: [min: number | null, max: number | null]
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

    let indexActual = 0
    let indexExpected = 0

    let expectedIteratorResultPromise = this._expected.next()
    let actualIteratorResultPromise = actual.next()
    let expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
      ? await expectedIteratorResultPromise
      : expectedIteratorResultPromise
    let actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
      ? await actualIteratorResultPromise
      : actualIteratorResultPromise

    while (true) {
      while (true) {
        if (actualIteratorResult.done || expectedIteratorResult.done) {
          if (!this._options?.canBeDoneBefore && !expectedIteratorResult.done) {
            expectedIteratorResultPromise = this._expected.next()
            expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
              ? await expectedIteratorResultPromise
              : expectedIteratorResultPromise

            return {
              result: false,
              cause : `actual iterator (index=${indexActual}) is done before expected iterator (index=${indexExpected})`,
              nested: [
                {
                  actualKey   : indexActual,
                  result: createMatchResultSync(
                    void 0,
                    expectedIteratorResult.value,
                    `actual iterator (index=${indexActual}) is done before expected iterator (index=${indexExpected})`,
                  ),
                },
              ],
            }
          }

          if (!this._options?.canBeDoneAfter && !actualIteratorResult.done) {
            actualIteratorResultPromise = actual.next()
            actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
              ? await actualIteratorResultPromise
              : actualIteratorResultPromise

            return {
              result: false,
              cause : `actual iterator (index=${indexActual}) is not done when expected iterator (index=${indexExpected}) is done`,
              nested: [
                {
                  actualKey   : indexActual,
                  result: createMatchResultSync(
                    actualIteratorResult.value,
                    void 0,
                    `actual iterator (index=${indexActual}) is not done when expected iterator (index=${indexExpected}) is done`,
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

        const matchResult = await matchAsync(actualIteratorResult.value, expectedIteratorResult.value)

        nested.push({
          actualKey   : indexActual,
          result: matchResult,
        })

        if (matchResult.result) {
          if (TODO1) {
            indexActual++
            actualIteratorResultPromise = actual.next()
            actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
              ? await actualIteratorResultPromise
              : actualIteratorResultPromise
            continue
          }
          else if (TODO2) {
            indexExpected++
            expectedIteratorResultPromise = this._expected.next()
            expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
              ? await expectedIteratorResultPromise
              : expectedIteratorResultPromise
            continue
          }
          else if (TODO3) {
            return {
              result: false,
              nested: [
                {
                  actualKey   : indexActual,
                  result: matchResult,
                },
              ],
            }
          }
        }
        else if (TODO4) {
          indexActual++
          actualIteratorResultPromise = actual.next()
          actualIteratorResult = isPromiseLike(actualIteratorResultPromise)
            ? await actualIteratorResultPromise
            : actualIteratorResultPromise
          continue
        }
        else if (TODO5) {
          indexExpected++
          expectedIteratorResultPromise = this._expected.next()
          expectedIteratorResult = isPromiseLike(expectedIteratorResultPromise)
            ? await expectedIteratorResultPromise
            : expectedIteratorResultPromise
          continue
        }
        else if (TODO6) {
          return {
            result: false,
            nested: [
              {
                actualKey   : indexActual,
                result: matchResult,
              },
            ],
          }
        }

        break
      }

      indexActual++
      indexExpected++
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
              actualKey   : index,
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
                actualKey   : index,
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
                actualKey   : index,
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
        actualKey   : index,
        result: matchResult,
      })
    }
  }

  toString() {
    return `TODO`
  }
}
