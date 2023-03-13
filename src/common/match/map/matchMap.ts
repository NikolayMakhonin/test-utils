import {MatchMapOptions} from './contracts'

export function matchMap<T>(
  actual: Map<any, T>,
  expected: Map<any, T>,
  match: (actual: T, expected: T) => boolean,
  options: MatchMapOptions,
): boolean {
  for (const [actualKey, actualValue] of actual) {
    if (expected.has(actualKey)) {
      const expectedValue = expected.get(actualKey)
      if (!match(actualValue, expectedValue)) {
        return false
      }
    }
    else if (options?.mayNotContained) {
      return false
    }
  }

  if (options?.mayNotContains) {
    for (const [expectedKey] of expected) {
      if (!actual.has(expectedKey)) {
        return false
      }
    }
  }

  return true
}
