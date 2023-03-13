import {ANY} from 'src/common/match/contracts'

export function isMatcher(value: any): boolean {
  return typeof value === 'object'
}

export function getKey(value: any): any {
  if (isMatcher(value)) {
    return ANY
  }
  return value
}

export function getValue(value: any): number {
  if (isMatcher(value)) {
    return value.value
  }
  return value
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
