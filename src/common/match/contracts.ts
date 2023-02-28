import type {Matcher} from './Matcher'

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

export type Match<T, Async extends boolean> = Async extends false
  ? MatchSync<T>
  : MatchAsync<T>
export type MatchSync<T> = (value: T) => MatchResult3
export type MatchAsync<T> = (value: T) => PromiseLikeOrValue<MatchResult3>

export type MatcherSync<T> = Matcher<T, false>
export type MatcherAsync<T> = Matcher<T, true>

export type Expected<T, Async extends boolean = boolean> = T | Matcher<T, Async>
export type ExpectedSync<T> = Expected<T, false>
export type ExpectedAsync<T> = Expected<T, true>

export type ToExpectedObject<T extends {}, Async extends boolean = boolean> = {
  [key in keyof T]: ToExpectedDeep<T[key], Async>
}

export type ToExpectedArray<T extends any[], Async extends boolean = boolean> =
  T extends Array<infer A> ? ToExpectedDeep<A, Async>[] : []

export type ToExpectedDeep<T, Async extends boolean = boolean> =
  T extends any[] ? ToExpectedArray<T, Async>
  : T extends {} ? ToExpectedObject<T, Async>
    : Expected<T, Async>


// export function isArrayContainingNItems<T>(item: T, count: number): MatcherSync<T[]> {
//   return new Matcher(
//     false,
//     (actual: T[]) => {
//       if (!Array.isArray(actual)) {
//         return 'is not an array'
//       }
//       const len = actual.length
//       if (len < count) {
//         return `array length < ${count}`
//       }
//       const nestedTrue: MatchResultNested[] = []
//       const nestedFalse: MatchResultNested[] = []
//       let matchCount = 0
//       for (let i = 0; i < len; i++) {
//         const result = matchSync(actual[i], item)
//         nestedFalse.push({
//           key: i,
//           result,
//         })
//         if (result.result) {
//           matchCount++
//           nestedTrue.push({
//             key: i,
//             result,
//           })
//         }
//         if (matchCount >= count) {
//           return {
//             result: true,
//             nested: nestedTrue,
//           }
//         }
//       }
//       return {
//         result: false,
//         cause : `array length >= ${count} but not enough items match`,
//         nested: nestedFalse,
//       }
//     },
//     () => `array containing ${count} items ${item}`,
//   )
// }
//
// export function isArrayContainingNItemsAsync<T>(item: T, count: number): MatcherAsync<T[]> {
//   return new Matcher(
//     true,
//     async (actual: T[]) => {
//       if (!Array.isArray(actual)) {
//         return 'is not an array'
//       }
//       const len = actual.length
//       if (len < count) {
//         return `array length < ${count}`
//       }
//       const nestedTrue: MatchResultNested[] = []
//       const nestedFalse: MatchResultNested[] = []
//       let matchCount = 0
//       for (let i = 0; i < len; i++) {
//         const result = await matchAsync(actual[i], item)
//         nestedFalse.push({
//           key: i,
//           result,
//         })
//         if (result.result) {
//           matchCount++
//           nestedTrue.push({
//             key: i,
//             result,
//           })
//         }
//         if (matchCount >= count) {
//           return {
//             result: true,
//             nested: nestedTrue,
//           }
//         }
//       }
//       return {
//         result: false,
//         cause : `array length >= ${count} but not enough items match`,
//         nested: nestedFalse,
//       }
//     },
//     () => `array containing ${count} items ${item}`,
//   )
// }
