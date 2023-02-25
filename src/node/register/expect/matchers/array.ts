import {expectedToString} from './helpers'
import type {CustomMatch} from './contracts'

export function expectArrayItemEvery(expected: any, options: {
  matchCount?: number,
} = {}): CustomMatch {
  function _expectArrayItemEvery(receivedArray) {
    const _this = this
    function message() {
      return `expected [${
        _this.utils.printExpected(expected)
      }], but received ${
        _this.utils.printReceived(receivedArray)
      }`
    }

    if (!Array.isArray(receivedArray)) {
      return {
        pass: false,
        message,
      }
    }

    let matchCount = 0
    for (let i = 0, len = receivedArray.length; i < len; i++) {
      const received = receivedArray[i]
      const pass = expected
        && typeof expected.asymmetricMatch === 'function'
        && expected.asymmetricMatch(received)
        || received === expected

      if (!pass) {
        return {
          pass   : false,
          message: () => `expected ${
            _this.utils.printExpected(expected)
          }, but received ${
            _this.utils.printReceived(received)
          }`,
        }
      }
    }

    return {
      pass: true,
      message,
    }
  }

  _expectArrayItemEvery.toString = function toString() {
    return expectedToString(expected)
  }

  return _expectArrayItemEvery
}
