import {matchAsync, matchSync} from './match'
import {createTestVariants} from '@flemist/test-variants'
import {isPromiseLike} from '@flemist/async-utils'
import {MatchResult} from './contracts'
import {MatchInternalError} from './MatchInternalError'
import {Matcher} from './Matcher'

describe('match > match', function () {
  const testError = new Error('Test error')
  const testNested = []

  function isInvalidResult({
    result,
    cause,
    nested,
  }: {
    result: any
    cause: any
    nested: any
  }) {
    return typeof result !== 'boolean'
      || typeof cause !== 'string' && cause != null
      || nested != null && !(nested instanceof Array)
  }

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
        if (isInvalidResult(matchResult)) {
          assert.ok(matchResult.error instanceof MatchInternalError,
            `matchResult.error must be an instance of MatchInternalError, but it is: ${matchResult.error}`)
          matchResultExpected = {
            actual,
            expected,
            result: null,
            cause : null,
            nested: null,
            error : matchResult.error,
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

  class TestMatcher extends Matcher<any, boolean> {
    readonly _async: boolean
    readonly error: boolean | 'async'
    readonly result: any
    readonly cause: any
    readonly nested: any

    constructor({
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
      super()
      this._async = async
      this.result = result
      this.cause = cause
      this.error = error
      this.nested = nested
    }

    get async() {
      return this._async
    }

    match(actual: any) {
      if (this.error) {
        if (this.error === 'async') {
          return Promise.reject(testError)
        }
        throw testError
      }
      const _result = {
        nested: this.nested ? testNested : null,
        result: this.result,
        cause : this.cause,
        error : 'Incorrect error',
      }
      if (this.async) {
        if (isPromiseLike(actual)) {
          return actual.then(() => _result)
        }
        return Promise.resolve(_result)
      }
      return _result
    }

    toString() {
      return `TestMatcher(${JSON.stringify({
        async : this.async,
        error : this.error,
        result: this.result,
        cause : this.cause,
      })})`
    }
  }

  it('variants', async function () {
    await testVariants({
      async: [false, true],
      _match({async}) {
        return async ? ['matchAsync'] : ['matchSync', 'matchAsync']
      },
      match({_match}) {
        return _match === 'matchAsync' ? [matchAsync] : [matchSync]
      },
      error      : [false, true],
      nested     : [null, testNested, void 0, false, {}],
      cause      : [null, 'Test cause', void 0, false, {}],
      result     : [false, true, null, void 0, '', {}],
      actualValue: [null, void 0, 0, false, '', {}],
      actual({async, match, actualValue}) {
        return async
          ? [actualValue, Promise.resolve(actualValue)]
          : [actualValue]
      },
      expected({
        async, match, error, nested, cause, result, actualValue,
      }) {
        const matcher = new TestMatcher({
          async,
          error,
          nested,
          cause,
          result,
        })

        if (isInvalidResult({result, cause, nested})) {
          return [matcher]
        }

        return !async && cause === null && nested === null && error === false
          ? [result ? actualValue : {}, matcher]
          : [matcher]
      },
    })()
  })
})
