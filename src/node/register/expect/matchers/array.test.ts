import {expectArrayItemEvery} from './array'

describe('expect > matchers > array', function () {
  it('base', function () {
    expect([1, 2, 3]).custom(expectArrayItemEvery(expect.any(Number)))
    expect(() => expect([1, 2, 3, true]).custom(expectArrayItemEvery(expect.any(Number))))
      .toThrowError('expected [32mAny<Number>[39m, but received [31mtrue[39m')

  })
})
