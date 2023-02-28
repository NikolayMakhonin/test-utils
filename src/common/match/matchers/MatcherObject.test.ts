import {testMatcher} from './test/testMatcher'
import {MatcherObject} from './MatcherObject'
import {MatcherMock} from './test/MatcherMock'

const EMPTY: any = new String('EMPTY')

const OBJECT = {}
const ARRAY = []
const actuals = [EMPTY, void 0, null, 0, false, '', 1, true, '1', OBJECT, ARRAY]

function matcherMock(async: boolean, result: boolean) {
  return new MatcherMock({
    async,
    result,
    cause : null,
    error : null,
    nested: null,
  })
}

describe('match > matchers > MatcherObject', function () {
  it('true', async function () {
    await testMatcher<{
      actual1: any,
      actual2: any,
      actual3: any,
      expected1: any,
      expected2: any,
      expected3: any,
      expected: any[],
    }>({
      async  : [false],
      actual1: actuals,
      actual2: actuals,
      actual3: actuals,
      actual({actual1, actual2, actual3}) {
        const actual = [actual1, actual2, actual3]
          .reduce((acc, o, i) => {
            if (o !== EMPTY) {
              acc[`prop${i}`] = o
            }
            return acc
          }, {})
        return [actual]
      },
      expected1: ({async, actual1}) => actual1 === EMPTY ? [EMPTY] : [actual1, matcherMock(async, true)],
      expected2: ({async, actual2}) => actual2 === EMPTY ? [EMPTY] : [actual2, matcherMock(async, true)],
      expected3: ({async, actual3}) => actual3 === EMPTY ? [EMPTY] : [actual3, matcherMock(async, true)],
      expected({expected1, expected2, expected3}) {
        const expected = [expected1, expected2, expected3]
          .reduce((acc, o, i) => {
            if (o !== EMPTY) {
              acc[`prop${i}`] = o
            }
            return acc
          }, {})
        return [expected]
      },
      matcher: ({async, expected}) => [new MatcherObject(async, expected)],
      result : [true],
      cause  : [null],
      nested : ({actual, expected, matcher, result}) => {
        const nested = []
        for (const key in expected) {
          if (Object.prototype.hasOwnProperty.call(expected, key)) {
            nested.push({
              key,
              result: {
                actual  : actual[key],
                expected: expected[key],
                result  : true,
                cause   : null,
                nested  : null,
                error   : null,
              },
            })
          }
        }
        return [nested]
      },
    })()
  })

  const diffValues = new Map<any, any>([
    [void 0, null],
    [null, void 0],
    [0, false],
    [false, 0],
    ['', true],
    [true, ''],
    ['1', 1],
    [1, '1'],
    [OBJECT, EMPTY],
    [ARRAY, {}],
  ])

  it('false', async function () {
    await testMatcher<{
      actual1: any,
      actual2: any,
      actual3: any,
      expected1: any,
      expected2: any,
      expected3: any,
      diffValueKey: string,
      expected: any[],
    }>({
      async  : [false],
      actual1: actuals,
      actual2: actuals,
      actual3: actuals,
      actual({actual1, actual2, actual3}) {
        const actual = [actual1, actual2, actual3]
          .reduce((acc, o, i) => {
            if (o !== EMPTY) {
              acc[`prop${i}`] = o
            }
            return acc
          }, {})
        return [actual]
      },
      expected1   : ({async, actual1}) => actual1 === EMPTY ? [EMPTY] : [actual1, matcherMock(async, true)],
      expected2   : ({async, actual2}) => actual2 === EMPTY ? [EMPTY] : [actual2, matcherMock(async, true)],
      expected3   : ({async, actual3}) => actual3 === EMPTY ? [EMPTY] : [actual3, matcherMock(async, true)],
      diffValueKey: ({actual}) => Object.keys(actual).concat(['propNonExist']),
      expected({diffValueKey, actual, expected1, expected2, expected3}) {
        const expected = [expected1, expected2, expected3]
          .reduce((acc, o, i) => {
            if (o !== EMPTY) {
              acc[`prop${i}`] = o
            }
            return acc
          }, {})

        const expectedItem = expected[diffValueKey]
        const diffValue = expectedItem instanceof MatcherMock
          ? matcherMock(expectedItem.async, false)
          : diffValues.get(expectedItem)

        if (diffValue === EMPTY) {
          delete expected[diffValueKey]
        }
        else {
          expected[diffValueKey] = diffValue
        }
        return [expected]
      },
      matcher: ({async, expected}) => [new MatcherObject(async, expected)],
      result : [false],
      cause  : ({actual, diffValueKey, expected, matcher, result}) => {
        if (diffValueKey in actual && !(diffValueKey in expected)) {
          return [`has unexpected key '${diffValueKey}'`]
        }
        return [null]
      },
      nested: ({actual, diffValueKey, expected, matcher, result}) => {
        if (diffValueKey in actual && !(diffValueKey in expected)) {
          return [null]
        }
        const nested = [{
          key   : diffValueKey,
          result: {
            actual  : actual[diffValueKey],
            expected: expected[diffValueKey],
            result  : false,
            cause   : null,
            nested  : null,
            error   : null,
          },
        }]
        return [nested]
      },
    })()
  })
})
