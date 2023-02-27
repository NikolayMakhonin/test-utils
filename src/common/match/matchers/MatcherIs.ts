import {Matcher} from '../Matcher'

export class MatcherIs<T = any> extends Matcher<T> {
  private readonly _expected: any
  private readonly _nonStrict: boolean

  constructor(expected: T, nonStrict?: boolean) {
    super()
    this._expected = expected
    this._nonStrict = nonStrict || false
  }

  get async() {
    return false as false
  }

  match(actual: any) {
    return this._nonStrict
      // eslint-disable-next-line eqeqeq
      ? actual == this._expected
      : actual === this._expected
  }

  toString() {
    return `is.${this._nonStrict ? 'nonStrict' : 'strict'}(${JSON.stringify(this._expected, null, 2)})`
  }
}
