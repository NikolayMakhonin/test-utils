export function isMatcher(value: any): boolean {
  return typeof value === 'object'
}

export function match(actual: any, expected: any): boolean {
  if (isMatcher(actual)) {
    actual = actual.value
  }
  if (isMatcher(expected)) {
    expected = expected.value
  }
  return actual === expected
}

export function addRepeats(arr: number[], index: number, count: number) {
  const result = [...arr]
  for (let i = 0; i < count; i++) {
    result.splice(index, 0, arr[index])
  }
  return result
}

export function addBreaks(arr: number[], index: number, count: number) {
  const result = [...arr]
  for (let i = 0; i < count; i++) {
    result.splice(index, 0, 0)
  }
  return result
}
