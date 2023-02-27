import type {Match} from './contracts'

export class Matcher<T,
  Async extends boolean = false,
  > {
  readonly async: boolean
  readonly match: Match<Async, T>
  readonly toString: () => string

  constructor(
    async: Async,
    match: Match<Async, T>,
    toString: () => string,
  ) {
    if (typeof async !== 'boolean') {
      throw new Error(`async must be boolean, but it is ${typeof async}`)
    }
    if (typeof match !== 'function') {
      throw new Error(`match must be function, but it is ${typeof match}`)
    }
    if (typeof toString !== 'function') {
      throw new Error(`toString must be function, but it is ${typeof toString}`)
    }

    this.async = async
    this.match = match
    this.toString = toString
  }
}
