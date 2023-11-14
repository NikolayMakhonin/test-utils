export function expectEquals(receiver: any, expected: any): boolean {
  if (receiver === expected) {
    return true
  }
  if (expected && typeof expected.asymmetricMatch === 'function') {
    return expected.asymmetricMatch(receiver)
  }
  return false
}

export function expectedToString(expected: any) {
  if (typeof expected.toAsymmetricMatcher === 'function') {
    return expected.toAsymmetricMatcher()
  }
  return expected + ''
}
