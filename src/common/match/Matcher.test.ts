import {Matcher} from './Matcher'
import {MatchInternalError} from './MatchInternalError'

describe('match > Matcher', function () {
  it('base', function () {
    const match = () => null
    const toString = () => null

    const matcher = new Matcher(true, match, toString)
    assert.strictEqual(matcher.async, true)
    assert.strictEqual(matcher.match, match)
    assert.strictEqual(matcher.toString, toString)

    assert.throws(() => new Matcher(null, () => null, () => null), MatchInternalError)
    assert.throws(() => new Matcher(void 0, () => null, () => null), MatchInternalError)
    assert.throws(() => new Matcher('' as any, () => null, () => null), MatchInternalError)

    assert.throws(() => new Matcher(true, null, () => null), MatchInternalError)
    assert.throws(() => new Matcher(true, void 0, () => null), MatchInternalError)
    assert.throws(() => new Matcher(true, '' as any, () => null), MatchInternalError)

    assert.throws(() => new Matcher(true, () => null, null), MatchInternalError)
    assert.throws(() => new Matcher(true, () => null, void 0), MatchInternalError)
    assert.throws(() => new Matcher(true, () => null, '' as any), MatchInternalError)
  })
})
