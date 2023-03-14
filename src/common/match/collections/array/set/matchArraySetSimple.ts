import {MatchArraySetOptions} from './contracts'

export function matchArraySetSimple<T>(
  actual: T[],
  expected: T[],
  isMatcher: (value: any) => boolean,
  match: (actual: T, expected: T) => boolean,
  options: MatchArraySetOptions,
): boolean {
  if (options?.mayNotContains && options?.mayNotContained) {
    throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`)
  }

  const actualValues = actual.slice()
  const expectedValues = expected.slice()
  const actualFound = []
  const expectedFound = []

  if (!options?.mayNotContains) {
    let actualIndex = 0
    while (actualIndex < actualValues.length) {
      const actualItem = actualValues[actualIndex]
      let found = false
      let expectedIndex = 0
      while (expectedIndex < expectedValues.length) {
        const expectedItem = expectedValues[expectedIndex]
        if (match(actualItem, expectedItem)) {
          expectedValues[expectedIndex] = expectedValues[expectedValues.length - 1]
          expectedValues.length--
          actualValues[actualIndex] = actualValues[actualValues.length - 1]
          actualValues.length--
          actualFound.push(actualItem)
          expectedFound.push(expectedItem)
          found = true
          break
        }
        else {
          expectedIndex++
        }
      }
      if (!found) {
        actualIndex++
      }
    }
  }

  if (!options?.mayNotContained) {
    let expectedIndex = 0
    while (expectedIndex < expectedValues.length) {
      const expectedItem = expectedValues[expectedIndex]
      let found = false
      let actualIndex = 0
      while (actualIndex < actualValues.length) {
        const actualItem = actualValues[actualIndex]
        if (match(actualItem, expectedItem)) {
          actualValues[actualIndex] = actualValues[actualValues.length - 1]
          actualValues.length--
          expectedValues[expectedIndex] = expectedValues[expectedValues.length - 1]
          expectedValues.length--
          actualFound.push(actualItem)
          expectedFound.push(expectedItem)
          found = true
          break
        }
        else {
          actualIndex++
        }
      }
      if (!found) {
        expectedIndex++
      }
    }
  }

  if (actualValues.length > 0) {
    if (options?.mayNotContained) {
      return true
    }

    if (options?.actualRepeats) {
      for (let actualIndex = 0, len = actualValues.length; actualIndex < len; actualIndex++) {
        const actualItem = actualValues[actualIndex]
        let found = false
        for (let expectedIndex = 0, len = expectedFound.length; expectedIndex < len; expectedIndex++) {
          const expectedItem = expectedFound[expectedIndex]
          if (match(actualItem, expectedItem)) {
            found = true
            break
          }
        }
        if (!found) {
          return false
        }
        actualIndex++
      }
    }
    else {
      return false
    }
  }

  if (expectedValues.length > 0) {
    if (options?.mayNotContains) {
      return true
    }

    if (options?.expectedRepeats) {
      for (let expectedIndex = 0, len = expectedValues.length; expectedIndex < len; expectedIndex++) {
        const expectedItem = expectedValues[expectedIndex]
        let found = false
        for (let actualIndex = 0, len = actualFound.length; actualIndex < len; actualIndex++) {
          const actualItem = actualFound[actualIndex]
          if (match(actualItem, expectedItem)) {
            found = true
            break
          }
        }
        if (!found) {
          return false
        }
        expectedIndex++
      }
    }
    else {
      return false
    }
  }

  return true
}
