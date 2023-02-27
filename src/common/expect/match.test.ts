import {matchAsync, matchSync} from './match'
import {createTestVariants} from '@flemist/test-variants'
import {isPromiseLike} from '@flemist/async-utils'
import {MatchResult} from './contracts'
import {Matcher} from './Matcher'

describe('match', function () {
  const testError = new Error('Test error')
  const testNested = []

  const testVariants = createTestVariants(async ({
    async,
    match,
    error,
    nested,
    cause,
    result,
    actual,
    expected,
  }: {
    async: boolean
    match: typeof matchAsync | typeof matchSync
    error: boolean | 'async'
    nested: any
    cause: any
    result: any
    actual: any
    expected: any
  }) => {
    const matchResultPromise = match(actual, expected)
    let matchResult: MatchResult<any>
    if (async && (!error || error === 'async')) {
      assert.ok(isPromiseLike(matchResultPromise), 'matchResult is not a promise')
      matchResult = await matchResultPromise
    }
    else {
      assert.ok(!isPromiseLike(matchResultPromise), 'matchResult is a promise')
      matchResult = matchResultPromise
    }

    try {
      let matchResultExpected: MatchResult<any>
      if (error) {
        matchResultExpected = {
          actual,
          expected,
          result: null,
          cause : null,
          nested: null,
          error : testError,
        }
      }
      else {
        matchResultExpected = {
          actual,
          expected,
          result,
          cause,
          nested: nested ? testNested : null,
          error : null,
        }
      }

      const keys = Object.keys(matchResult) as (keyof MatchResult<any>)[]
      const keysExpected = Object.keys(matchResultExpected) as (keyof MatchResult<any>)[]
      assert.strictEqual(keys.length, keysExpected.length,
        `keys.length (${keys.length}) !== keysExpected.length (${keysExpected.length})`)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        assert.strictEqual(key, keysExpected[i])
        assert.strictEqual(matchResult[key], matchResultExpected[key], key)
      }
    }
    catch (err) {
      console.error('matchResult', matchResult)
      throw err
    }
  })

  function createTestMatcher({
    async,
    result,
    cause,
    error,
    nested,
  }: {
    async: boolean
    result: any
    cause: any
    error: boolean | 'async'
    nested: any
  }) {
    return new Matcher(
      async,
      function (actual: any) {
        if (error) {
          if (error === 'async') {
            return Promise.reject(testError)
          }
          throw testError
        }
        const _result = {
          nested: nested ? testNested : null,
          result,
          cause,
          error : 'Incorrect error',
        }
        if (async) {
          if (isPromiseLike(actual)) {
            return actual.then(() => _result)
          }
          return Promise.resolve(_result)
        }
        return _result
      },
      function () {
        return `TestMatcher(${JSON.stringify({async, error, result, cause})})`
      },
    )
  }

  it('Matcher constructor throws', function () {
    new Matcher(true, () => null, () => null)
    assert.throws(() => new Matcher(null, () => null, () => null))
    assert.throws(() => new Matcher(void 0, () => null, () => null))
    assert.throws(() => new Matcher('' as any, () => null, () => null))

    assert.throws(() => new Matcher(true, null, () => null))
    assert.throws(() => new Matcher(true, void 0, () => null))
    assert.throws(() => new Matcher(true, '' as any, () => null))

    assert.throws(() => new Matcher(true, () => null, null))
    assert.throws(() => new Matcher(true, () => null, void 0))
    assert.throws(() => new Matcher(true, () => null, '' as any))
  })

  it('async', async function () {
    await testVariants({
      async: [false, true],
      _match({async}) {
        return async ? ['matchAsync'] : ['matchSync', 'matchAsync']
      },
      match({_match}) {
        return _match === 'matchAsync' ? [matchAsync] : [matchSync]
      },
      error      : [false, true],
      nested     : [null, testNested], // , void 0, false, {}],
      cause      : [null, 'Test cause'], // , void 0, false, {}],
      result     : [false, true], // , null, void 0, '', {}],
      actualValue: [null, void 0, 0, false, '', {}],
      actual({async, match, actualValue}) {
        return async
          ? [actualValue, Promise.resolve(actualValue)]
          : [actualValue]
      },
      expected({
        async, match, error, nested, cause, result, actualValue,
      }) {
        const matcher = createTestMatcher({
          async,
          error,
          nested,
          cause,
          result,
        })
        return !async && cause === null && nested === null && error === false
          ? [result ? actualValue : {}, matcher]
          : [matcher]
      },
    })()
  })
})
