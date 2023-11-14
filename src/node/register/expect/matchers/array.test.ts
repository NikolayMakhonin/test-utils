// import {expectArrayItems, expectArrayLength} from './array'
//
// describe('expect > matchers > array', function () {
//   it('expectArrayItems', function () {
//     expect([1, 2, 3]).custom(expectArrayItems(expect.any(Number)))
//     expect(() => expect([1, 2, 3, true]).custom(expectArrayItems(expect.any(Number))))
//       .toThrowError('expected [32mAny<Number>[39m, but received [31mtrue[39m')
//     expect(() => expect([]).custom(expectArrayItems(expect.any(Number))))
//   })
//
//   it('expectArrayLength', function () {
//     expect([1, 2, 3]).custom(expectArrayLength(3))
//     expect(() => expect([1, 2, 3]).custom(expectArrayLength(2)))
//       .toThrowError('expected length [32m2[39m, but received [31m3[39m')
//
//     expect([]).custom(expectArrayLength(0))
//     expect(() => expect([]).custom(expectArrayLength(1)))
//       .toThrowError('expected length [32m1[39m, but received [31m0[39m')
//
//     expect([1, 2, 3]).custom(expectArrayLength(expect.any(Number)))
//     expect(() => expect([1, 2, 3]).custom(expectArrayLength(expect.any(String))))
//       .toThrowError('expected length [32mAny<String>[39m, but received [31m3[39m')
//   })
//
//   it('complex', function () {
//     const expected = {
//       a: expect.custom(expectArrayItems(1)),
//       c: expect.custom(expectArrayItems(expect.objectContaining({
//         d: expect.custom(expectArrayItems(2)),
//         e: {
//           f: expect.custom(expectArrayItems(3)),
//           g: [
//             expect.custom(expectArrayItems(4)),
//             expect.custom(expectArrayItems(expect.any(Number))),
//           ],
//         },
//       }))),
//     }
//
//     expect({a: [1], c: [{d: [2], e: {f: [3], g: [4, 5]}}]}).toMatchObject(expected)
//   })
// })
