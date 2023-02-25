import {AsymmetricMatchers, BaseExpect, expect, Matchers} from 'expect'

type AsymmetricMatcher_2 = {
  asymmetricMatch(other: unknown): boolean;
  toString(): string;
  getExpectedType?(): string;
  toAsymmetricMatcher?(): string;
}

type MatchersExt<R extends void | Promise<void>> = Matchers<R> & {
  custom: (check: (received: unknown) => { pass: boolean, message: string | (() => string) }) => R,
  toMatchValue: (asyncMatcher: AsymmetricMatcher_2) => R,
}

type AsymmetricMatchersExt = AsymmetricMatchers & {
  custom: (
    check: (received: unknown) => boolean | { pass: boolean, message: string | (() => string) },
    message?: string | (() => string),
  ) => AsymmetricMatcher_2,
}

type Inverse<Matchers> = {
  /**
   * Inverse next matcher. If you know how to test something, `.not` lets you test its opposite.
   */
  not: Matchers;
}

type PromiseMatchersExt = {
  /**
   * Unwraps the reason of a rejected promise so any other matcher can be chained.
   * If the promise is fulfilled the assertion fails.
   */
  rejects: MatchersExt<Promise<void>> & Inverse<MatchersExt<Promise<void>>>;
  /**
   * Unwraps the value of a fulfilled promise so any other matcher can be chained.
   * If the promise is rejected the assertion fails.
   */
  resolves: MatchersExt<Promise<void>> & Inverse<MatchersExt<Promise<void>>>;
}

type ExpectExt = (
  <T = unknown>(actual: T) => MatchersExt<void> &
    Inverse<MatchersExt<void>> &
    PromiseMatchersExt
) & BaseExpect &
  AsymmetricMatchersExt &
  Inverse<Omit<AsymmetricMatchersExt, 'any' | 'anything'>>

// const _expect: typeof expect = typeof (expect as any).default === 'function'
//   ? (expect as any).default
//   : expect

expect.extend({
  // or(received, ...expecteds: any[]) {
  //   function message() {
  //     return `expected ${expecteds
  //       .map(expected => this.utils.printExpected(expected))
  //       .join(' | ')}, but received ${this.utils.printReceived(received)}`
  //   }
  //
  //   for (let i = 0, len = expecteds.length; i < len; i++) {
  //     const expected = expecteds[i]
  //     if (
  //       (expected
  //         && typeof expected.asymmetricMatch === 'function'
  //         && expected.asymmetricMatch(received))
  //       || received === expected
  //     ) {
  //       return {
  //         pass: true,
  //         message,
  //       }
  //     }
  //   }
  //
  //   return {
  //     pass: false,
  //     message,
  //   }
  // },
  custom(received, expected: (received: any) => boolean | { pass: boolean, message: () => string }) {
    const result = expected(received)
    if (typeof result === 'boolean') {
      // it is asymmetric matcher
      return {
        pass   : result,
        message: void 0, // message is not used in asymmetric matchers
      }
    }
    return result
  },
})

const custom = (expect as ExpectExt).custom
;(expect as ExpectExt).custom = (check, message) => {
  if (message == null) {
    return custom.call(expect, check)
  }

  const newCheck = function newCheck() {
    return check.apply(this, arguments)
  }
  Object.defineProperty(newCheck, 'name', {value: check.name})

  if (typeof message === 'string') {
    newCheck.toString = function toString() {
      return message
    }
  }
  else if (typeof message === 'function') {
    newCheck.toString = message
  }
  else {
    throw new Error('expect.custom: message must be a string or a function')
  }

  return custom.call(expect, newCheck)
}

export default expect as ExpectExt
