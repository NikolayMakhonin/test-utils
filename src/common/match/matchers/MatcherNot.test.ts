import {MatcherIs} from './MatcherIs'
import {testMatcher} from './test/testMatcher'
import {MatcherNot} from './MatcherNot'

const actuals = [void 0, null, 0, false, '', 1, true, '1', {}, []]

describe('match > matchers > MatcherNot', function () {
  it('false', async function () {
    await testMatcher({
      async    : [false, true],
      nonStrict: [false, true],
      actual   : actuals,
      expected : ({actual, nonStrict}) => actuals
        // eslint-disable-next-line eqeqeq
        .filter(o => nonStrict ? o == actual : o === actual),
      matcherNested: ({expected, nonStrict}) => [new MatcherIs(expected, nonStrict)],
      matcher      : ({async, matcherNested}) => [new MatcherNot(async, matcherNested)],
      result       : [false],
      cause        : [null],
      nested       : ({actual, matcherNested, result}) => [[{
        key   : null,
        result: {
          actual,
          expected: matcherNested,
          result  : !result,
          cause   : null,
          nested  : null,
          error   : null,
        },
      }]],
    })()
  })

  it('true', async function () {
    await testMatcher({
      async    : [false, true],
      nonStrict: [false, true],
      actual   : actuals,
      expected : ({actual, nonStrict}) => actuals
        // eslint-disable-next-line eqeqeq
        .filter(o => nonStrict ? o != actual : o !== actual),
      matcherNested: ({expected, nonStrict}) => [new MatcherIs(expected, nonStrict)],
      matcher      : ({async, matcherNested}) => [new MatcherNot(async, matcherNested)],
      result       : [true],
      cause        : [null],
      nested       : ({actual, matcherNested, result}) => [[{
        key   : null,
        result: {
          actual,
          expected: matcherNested,
          result  : !result,
          cause   : null,
          nested  : null,
          error   : null,
        },
      }]],
    })()
  })
})
