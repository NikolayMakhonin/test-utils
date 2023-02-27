import {Matcher} from '../Matcher'

export class MatcherIs extends Matcher {
  readonly _expected: any

  constructor(expected: any) {
    super()
    this._expected = expected
  }

  get async() {
    return false as false
  }

  match(actual: any) {
    return actual === this._expected
  }

  toString() {
    return `is(${this._expected})`
  }
}
