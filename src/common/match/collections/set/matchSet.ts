import {MatchSetOptions} from './contracts'

export function matchSet<T>(
  actual: Set<T>,
  expected: Set<T>,
  options: MatchSetOptions,
): boolean {
  if (!options?.mayNotContained) {
    for (const actualValue of actual) {
      if (!expected.has(actualValue)) {
        return false
      }
    }
  }

  if (!options?.mayNotContains) {
    for (const expectedValue of expected) {
      if (!actual.has(expectedValue)) {
        return false
      }
    }
  }

  return true
}
