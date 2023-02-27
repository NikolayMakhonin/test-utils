import {MatcherIs} from './MatcherIs'
import {testMatcher} from './test/testMatcher'

const actuals = [void 0, null, 0, false, '', 1, true, '1', {}, []]

describe('match > matchers > MatcherIs', function () {
  it('true', async function () {
    await testMatcher({
      async    : [false],
      nonStrict: [false, true],
      actual   : [void 0, null, 0, false, '', 1, true, '1', {}, []],
      expected : ({actual, nonStrict}) => actuals
        // eslint-disable-next-line eqeqeq
        .filter(o => nonStrict ? o == actual : o === actual),
      matcher: ({actual, expected, nonStrict}) => [new MatcherIs(expected, nonStrict)],
      result : [true],
      cause  : [null],
      nested : [null],
    })()
  })

  it('false', async function () {
    await testMatcher({
      async    : [false],
      nonStrict: [false, true],
      actual   : actuals,
      expected : ({actual, nonStrict}) => actuals
        // eslint-disable-next-line eqeqeq
        .filter(o => nonStrict ? o != actual : o !== actual),
      matcher: ({actual, expected, nonStrict}) => [new MatcherIs(expected, nonStrict)],
      result : [false],
      cause  : [null],
      nested : [null],
    })()
  })
})
