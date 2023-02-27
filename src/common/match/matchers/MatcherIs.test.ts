import {MatcherIs} from './MatcherIs'
import {testMatcher} from './test/testMatcher'

describe('match > matchers > MatcherIs', function () {
  it('true', function () {
    testMatcher({
      actual : [void 0, null, 0, false, '', 1, true, '1', {}, []],
      async  : [false],
      matcher: ({actual}) => [new MatcherIs(actual)],
      result : [true],
      cause  : [null],
      nested : [null],
    })()
  })

  it('false', function () {
    const actuals = [void 0, null, 0, false, '', 1, true, '1', {}, []]
    testMatcher({
      actual : actuals,
      async  : [false],
      matcher: ({actual}) => actuals.filter(o => o !== actual).map(o => new MatcherIs(o)),
      result : [false],
      cause  : [null],
      nested : [null],
    })()
  })
})
