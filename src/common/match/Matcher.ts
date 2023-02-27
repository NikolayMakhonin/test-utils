import type { MatchResult3, PromiseLikeOrValue} from './contracts'
import {MatchInternalError} from './MatchInternalError'

export abstract class Matcher<
  T = any,
  Async extends boolean = boolean,
> {
  abstract get async(): Async
  abstract match(actual: T): Async extends false
    ? MatchResult3
    : PromiseLikeOrValue<MatchResult3>
  abstract toString(): string

  // constructor(
  //   async: Async,
  //   match: Match<Async, T>,
  //   toString: () => string,
  // ) {
  //   if (typeof async !== 'boolean') {
  //     throw new MatchInternalError(`async must be boolean, but it is ${typeof async}`)
  //   }
  //   if (typeof match !== 'function') {
  //     throw new MatchInternalError(`match must be function, but it is ${typeof match}`)
  //   }
  //   if (typeof toString !== 'function') {
  //     throw new MatchInternalError(`toString must be function, but it is ${typeof toString}`)
  //   }
  //   if (match.name !== 'match') {
  //     throw new MatchInternalError(`match must be a function named "match", but it is named "${match.name}"`)
  //   }
  //   if (toString.name !== 'toString') {
  //     throw new MatchInternalError(`toString must be a function named "toString", but it is named "${toString.name}"`)
  //   }
  //
  //   this.async = async
  //   this.match = match
  //   this.toString = toString
  // }
}
