export function expectedToString(expected: any) {
  if (typeof expected.toAsymmetricMatcher === 'function') {
    return expected.toAsymmetricMatcher()
  }
  return expected + ''
}
