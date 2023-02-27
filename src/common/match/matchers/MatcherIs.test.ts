import {MatcherIs} from './MatcherIs'
import {testMatcher} from './test/testMatcher'

const actuals = [void 0, null, 0, false, '', 1, true, '1', {}, []]

describe('match > matchers > MatcherIs', function () {
  it('true', function () {
    testMatcher({
      nonStrict: [false, true],
      actual   : [void 0, null, 0, false, '', 1, true, '1', {}, []],
      async    : [false],
      matcher  : ({actual, nonStrict}) => actuals
        // eslint-disable-next-line eqeqeq
        .filter(o => nonStrict ? o != actual : o !== actual)
        .map(o => new MatcherIs(o)),
      result: [true],
      cause : [null],
      nested: [null],
    })()
  })

  it('false', function () {
    testMatcher({
      nonStrict: [false, true],
      actual   : actuals,
      async    : [false],
      matcher  : ({actual, nonStrict}) => actuals
        // eslint-disable-next-line eqeqeq
        .filter(o => nonStrict ? o == actual : o === actual)
        .map(o => new MatcherIs(o)),
      result: [false],
      cause : [null],
      nested: [null],
    })()
  })
})
