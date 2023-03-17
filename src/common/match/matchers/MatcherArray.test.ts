import {testMatcher} from './test/testMatcher'
import {MatcherArray} from './MatcherArray'
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

describe('match > matchers > MatcherArray', function () {
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
        const actual = [actual1, actual2, actual3].filter(o => o !== EMPTY)
        return [actual]
      },
      expected1: ({async, actual1}) => actual1 === EMPTY ? [EMPTY] : [actual1, matcherMock(async, true)],
      expected2: ({async, actual2}) => actual2 === EMPTY ? [EMPTY] : [actual2, matcherMock(async, true)],
      expected3: ({async, actual3}) => actual3 === EMPTY ? [EMPTY] : [actual3, matcherMock(async, true)],
      expected({expected1, expected2, expected3}) {
        const expected = [expected1, expected2, expected3].filter(o => o !== EMPTY)
        return [expected]
      },
      matcher: ({async, expected}) => [new MatcherArray(async, expected)],
      result : [true],
      cause  : [null],
      nested : ({actual, expected, matcher, result}) => {
        const nested = []
        for (let index = 0; index < expected.length; index++) {
          nested.push({
            actualKey: index,
            result   : {
              actual  : actual[index],
              expected: expected[index],
              result  : true,
              cause   : null,
              nested  : null,
              error   : null,
            },
          })
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
    [OBJECT, []],
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
      diffValueIndex: number,
      expected: any[],
    }>({
      async  : [false],
      actual1: actuals,
      actual2: actuals,
      actual3: actuals,
      actual({actual1, actual2, actual3}) {
        const actual = [actual1, actual2, actual3].filter(o => o !== EMPTY)
        return [actual]
      },
      expected1     : ({async, actual1}) => actual1 === EMPTY ? [EMPTY] : [actual1, matcherMock(async, true)],
      expected2     : ({async, actual2}) => actual2 === EMPTY ? [EMPTY] : [actual2, matcherMock(async, true)],
      expected3     : ({async, actual3}) => actual3 === EMPTY ? [EMPTY] : [actual3, matcherMock(async, true)],
      diffValueIndex: ({actual}) => Array.from({length: actual.length + 1}, (_, index) => index),
      expected({diffValueIndex, actual, expected1, expected2, expected3}) {
        const expected = [expected1, expected2, expected3].filter(o => o !== EMPTY)
        const expectedItem = expected[Math.min(actual.length - 1, diffValueIndex)]
        const diffValue = expectedItem instanceof MatcherMock
          ? matcherMock(expectedItem.async, false)
          : diffValues.get(expectedItem)
        expected[diffValueIndex] = diffValue
        return [expected]
      },
      matcher: ({async, expected}) => [new MatcherArray(async, expected)],
      result : [false],
      cause  : ({actual, diffValueIndex, expected, matcher, result}) => {
        if (actual.length !== expected.length) {
          return [`length is not ${expected.length}`]
        }
        return [null]
      },
      nested: ({actual, diffValueIndex, expected, matcher, result}) => {
        if (actual.length !== expected.length) {
          return [null]
        }
        const nested = [{
          actualKey: diffValueIndex,
          result   : {
            actual  : actual[diffValueIndex],
            expected: expected[diffValueIndex],
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
