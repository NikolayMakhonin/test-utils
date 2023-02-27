import {Expected, ExpectedAsync, ExpectedSync, MatchResult} from './contracts'
import {matchAsync, matchSync} from './match'
import {isPromiseLike} from '@flemist/async-utils'

export type CheckResult<T, Async extends boolean> = Async extends false
  ? CheckResultSync<T>
  : CheckResultAsync<T>
export type CheckResultSync<T> = (expected: ExpectedSync<T>) => CheckResultSync<T>
export type CheckResultAsync<T> = (expected: ExpectedAsync<T>) => CheckResultAsync<T> & PromiseLike<void>

export class Checker<T, Async extends boolean> implements PromiseLike<void> {
  protected readonly actual: T

  constructor(
    async: Async,
    actual: T,
  ) {
    this.actual = actual
    this._async = async || false as any
  }

  private readonly _async: Async
  get async() {
    return this._async
  }

  protected throwError(result: MatchResult<any>) {
    throw new Error('check failed') // TODO: implement error message builder
  }

  protected checkSync(expected: ExpectedSync<T>): void {
    const result = matchSync(this.actual, expected)
    if (result.result === false) {
      this.throwError(result)
    }
  }

  protected async checkAsync(expected: ExpectedAsync<T>): Promise<void> {
    const result = await matchAsync(this.actual, expected)
    if (result.result === false) {
      this.throwError(result)
    }
  }

  private readonly _promises: PromiseLike<any>[] = []
  check(expected: Expected<T, Async>) {
    if (this.async) {
      const result = this.checkAsync(expected as any) as any
      if (isPromiseLike(result)) {
        this._promises.push(result)
      }
      return this
    }
    this.checkSync(expected as any)
    return this
  }

  then(resolve, reject) {
    return Promise.all(this._promises)
      .then(() => resolve(), () => reject())
  }
}

export function checkSync<T>(actual: T): CheckResultSync<T> {
  const checker = new Checker(false, actual)

  function check(expected: ExpectedSync<T>) {
    void checker.check(expected)
    return check
  }

  return check
}

export function checkAsync<T>(actual: T): CheckResultAsync<T> {
  const checker = new Checker(true, actual)

  function check(expected: ExpectedAsync<T>) {
    void checker.check(expected)
    return check
  }

  check.then = function then(resolve, reject) {
    return checker.then(resolve, reject)
  }

  return check as any
}

export const check: typeof checkSync & {
  async: typeof checkAsync
} = checkSync as any
check.async = checkAsync

check(1)(1)
check.async(1)(1)
