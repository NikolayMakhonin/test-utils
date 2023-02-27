import {Matcher} from '../../Matcher'
import {isPromiseLike} from '@flemist/async-utils'

export class MatcherMock extends Matcher {
  readonly _async: boolean
  readonly error: Error | Promise<any>
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
    error: Error | Promise<any>
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
      if (isPromiseLike(this.error)) {
        return this.error
      }
      throw this.error
    }
    const _result = {
      nested: this.nested ?? null,
      result: this.result ?? null,
      cause : this.cause ?? null,
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
    return `MatcherMock(${JSON.stringify({
      async : this.async,
      error : this.error,
      result: this.result,
      cause : this.cause,
    })})`
  }
}
