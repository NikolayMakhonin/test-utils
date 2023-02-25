import {expectedToString} from './helpers'
import {CustomMatch} from './contracts'

export function expectOr(...expecteds: any[]): CustomMatch {
  function _expectOr(received) {
    const _this = this
    function message() {
      return `expected ${expecteds
        .map(expected => _this.utils.printExpected(expected))
        .join(' | ')}, but received ${_this.utils.printReceived(received)}`
    }

    for (let i = 0, len = expecteds.length; i < len; i++) {
      const expected = expecteds[i]
      const pass = expected
        && typeof expected.asymmetricMatch === 'function'
        && expected.asymmetricMatch(received)
        || received === expected
      if (pass) {
        return {
          pass: true,
          message,
        }
      }
    }

    return {
      pass: false,
      message,
    }
  }

  _expectOr.toString = function toString() {
    return `or(${expecteds
      .map(expectedToString)
      .join(' | ')})`
  }

  return _expectOr
}

export function expectAnd(...expecteds: any[]): CustomMatch {
  function _expectAnd(received) {
    const _this = this
    function message() {
      return `expected ${expecteds
        .map(expected => _this.utils.printExpected(expected))
        .join(' & ')}, but received ${_this.utils.printReceived(received)}`
    }

    for (let i = 0, len = expecteds.length; i < len; i++) {
      const expected = expecteds[i]
      const pass = expected
        && typeof expected.asymmetricMatch === 'function'
        && expected.asymmetricMatch(received)
        || received === expected
      if (!pass) {
        return {
          pass: false,
          message,
        }
      }
    }

    return {
      pass: true,
      message,
    }
  }

  _expectAnd.toString = function toString() {
    return `and(${expecteds
      .map(expectedToString)
      .join(' | ')})`
  }

  return _expectAnd
}
