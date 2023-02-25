import expect from './expect'

describe('expect', function () {
  it('custom', function () {
    function createMatcher(expected: any) {
      const f = received => {
        return {
          pass   : received === expected,
          message: () => `expected ${received} to be ${expected}`,
        }
      }
      f.toString = () => `expect.custom(...)`
      return f
    }

    expect(1).custom(createMatcher(1))
    expect(() => expect(1).custom(createMatcher(2))).toThrowError(new Error('expected 1 to be 2'))

    expect(1).toStrictEqual(expect.any(Number))
    expect(() => expect(1).toStrictEqual(expect.any(String))).toThrowError()

    expect(1).toStrictEqual(expect.custom(createMatcher(1), 'ERROR'))
    expect(() => expect(1).toStrictEqual(expect.custom(createMatcher(2), 'ERROR')))
      .toThrowError('custom<ERROR>')

    expect({x: 1}).toMatchObject({x: expect.custom(createMatcher(1), 'ERROR')})
    expect(() => expect({x: 1}).toMatchObject({x: expect.custom(createMatcher(2), 'ERROR')}))
      .toThrowError('custom<ERROR>')

    expect({x: 1}).toMatchObject({x: expect.custom(createMatcher(1), () => {
      return 'expected 1 to be 1'
    })})
    expect(() => expect({x: 1}).toMatchObject({x: expect.custom(createMatcher(2), () => {
      return 'expected 1 to be 2'
    })}))
      .toThrowError('custom<expected 1 to be 2>')

    expect(() => expect(1).toStrictEqual(expect.custom(() => {
      throw new Error('ERROR')
    })))
      .toThrowError(new Error('ERROR'))
    expect(() => expect(1).toStrictEqual(expect.custom(() => {
      throw new Error('ERROR')
    }, 'ERROR')))
      .toThrowError(new Error('ERROR'))
    expect(() => expect(1).custom(() => {
      throw new Error('ERROR')
    }))
      .toThrowError(new Error('ERROR'))
    expect(() => expect(1).custom(() => {
      throw new Error('ERROR')
    }))
      .toThrowError(new Error('ERROR'))
  })
})
