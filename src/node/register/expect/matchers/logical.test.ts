import expect from '../expect'
import {expectOr} from 'src/node/register/expect/matchers/logical'

describe('expect > matchers', function () {
  it('or', function () {
    // expect.custom(expectOr(...))
    expect(1).toEqual(expect.custom(expectOr(1, 2)))
    expect(2).toEqual(expect.custom(expectOr(1, 2)))
    expect(() => expect(3).toEqual(expect.custom(expectOr(1, 2)))).toThrowError('custom<or(1 | 2)>')

    // with expect.any
    expect(1).toEqual(expect.custom(expectOr(expect.any(Number), expect.any(String))))
    expect('1').toEqual(expect.custom(expectOr(expect.any(Number), expect.any(String))))
    expect(() => expect(true).toEqual(expect.any(Number)))
      .toThrowError('Any<Number>')
    expect(() => expect(true).toEqual(expect.custom(expectOr(expect.any(Number), expect.any(String)))))
      .toThrowError('custom<or(Any<Number> | Any<String>)>')

    // toMatchObject
    const expected = {
      a: expect.custom(expectOr(1, expect.any(Number))),
      b: expect.arrayContaining([
        {
          c: expect.custom(expectOr(3, 5)),
          d: [
            expect.custom(expectOr(4, 6)),
          ],
        },
      ]),
    }

    // eslint-disable-next-line no-multi-spaces,space-in-parens
    // expect(             {a: 1, b: [{ c: 3, d: [4] }, { c: 5, d: [6]}]}).toMatchObject(expected)
    // expect(() => expect({a: 1, b: [{ c: 0, d: [4] }]}).toMatchObject(expected))
    //   .toThrowError()
    // expect(() => expect({a: 1, b: [{ c: 3, d: [0] }, { c: 5, d: [6]}]}).toMatchObject(expected))
    //   .toThrowError()
    // expect(() => expect({a: 1, b: [{ c: 3, d: [4] }, { c: 0, d: [6]}]}).toMatchObject(expected))
    //   .toThrowError()
    // expect(() => expect({a: 1, b: [{ c: 3, d: [4] }, { c: 5, d: [0]}]}).toMatchObject(expected))
    //   .toThrowError()

    const expectedObject = {
      foo: 'bar',
      baz: 'qux',
    }

    const actualArray = [
      123,
      { foo: 'bar', baz: 'qux' },
      { foo: 'bar', baz: 'quux' },
      { foo: 'baz', baz: 'qux' },
    ]

    expect([
      123,
      { foo: 'bar', baz: 'qux' },
      { foo: 'bar', baz: 'quux' },
      { foo: 'baz', baz: 'qux' },
    ]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          foo: 'bar',
          baz: 'qux',
        }),
      ]),
    )
  })
})
