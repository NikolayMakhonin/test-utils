import {Matcher} from '../../Matcher'
import {MatchResult2} from '../../contracts'
import {createTestVariants} from '@flemist/test-variants'

export const testMatcher = createTestVariants(async ({
  matcher,
  async,
  actual,
  result,
  cause,
  nested,
}: {
  matcher: Matcher
  async: boolean
  actual: any
  result: boolean
  cause: string | null
  nested: any[] | null
}) => {
  assert.ok(matcher instanceof Matcher)
  assert.strictEqual(typeof matcher.async, 'boolean')
  assert.strictEqual(typeof matcher.match, 'function')
  assert.strictEqual(typeof matcher.toString, 'function')

  assert.strictEqual(matcher.async, async)

  const matchResultPromise = matcher.match(actual)
  const matchResult: MatchResult2 = async
    ? await matchResultPromise
    : matchResultPromise as any

  if (typeof matchResult === 'boolean' || typeof matchResult === 'string') {
    assert.strictEqual(matchResult, result)
  }
  else {
    assert.strictEqual(matchResult.result ?? null, result ?? null)
    assert.strictEqual(matchResult.cause ?? null, cause ?? null)
    assert.deepStrictEqual(matchResult.nested ?? null, nested ?? null)
    assert.ok(Object.keys(matchResult).every(key => key === 'result' || key === 'cause' || key === 'nested'))
  }
})
