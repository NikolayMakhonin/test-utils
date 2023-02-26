import {matchSync} from 'src/common/expect/match'

export type PromiseLikeOrValue<T> = T | PromiseLike<T>

export type MatchResultNested = {
  key: string | number
  result: MatchResult<any>
}

export type MatchResult<T> = {
  actual: T
  expected: Expected<T>
  result: boolean | null
  cause: string | null
  nested: MatchResultNested[] | null
  error: Error | null
}

export interface MatchResult2 {
  result: boolean
  cause?: string
  nested?: MatchResultNested[]
}

export type MatchResult3 = boolean | string | MatchResult2

export type MatchSync<T> = (value: T) => MatchResult3
export type MatchAsync<T> = (value: T) => PromiseLikeOrValue<MatchResult3>

export class Matcher<T, TMatch extends MatchAsync<T>> {
  readonly match: TMatch
  readonly toString: () => string
  constructor(match: TMatch, toString: () => string) {
    this.match = match
    this.toString = toString
  }
}

export type MatcherSync<T> = Matcher<T, MatchSync<T>>
export type MatcherAsync<T> = Matcher<T, MatchAsync<T>>

export type Expected<T> = T | MatcherSync<T> | MatcherAsync<T>
export type ExpectedSync<T> = T | MatcherSync<T>
export type ExpectedAsync<T> = T | MatcherAsync<T>

export function isArrayContainingNItems<T>(item: T, count: number): MatcherSync<T[]> {
  return new Matcher(
    (actual: T[]) => {
      if (!Array.isArray(actual)) {
        return 'is not an array'
      }
      const len = actual.length
      if (len < count) {
        return `array length < ${count}`
      }
      const nestedTrue: MatchResultNested[] = []
      const nestedFalse: MatchResultNested[] = []
      let matchCount = 0
      for (let i = 0; i < len; i++) {
        const result = matchSync(actual[i], item)
        nestedFalse.push({
          key: i,
          result,
        })
        if (result.result) {
          matchCount++
          nestedTrue.push({
            key: i,
            result,
          })
        }
        if (matchCount >= count) {
          return {
            result: true,
            nested: nestedTrue,
          }
        }
      }
      return {
        result: false,
        cause : `array length >= ${count} but not enough items match`,
        nested: nestedFalse,
      }
    },
    () => `array containing ${count} items ${item}`,
  )
}
