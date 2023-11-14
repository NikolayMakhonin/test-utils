// test:
// type X = ToExpectedArrayDeep<[a: 1, b: '2', c: { a: [true, ''] }], true>
// type Y = ToExpectedDeep<{ a: [true, ''] }[], false>
// export const x: X = null
// export const y: Y = null
// export const y0 = y[0]
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
const ANY = Symbol('ANY');
const UNSET = Symbol('UNSET');

export { ANY, UNSET };
