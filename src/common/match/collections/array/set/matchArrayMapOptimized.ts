import {MatchArraySetOptions} from './contracts'
import {ANY} from "src/common/match/contracts";

export function matchArrayMapOptimized<T>(
  actual: T[],
  expected: T[],
  getKey: (value: T) => any,
  match: (actual: T, expected: T) => boolean,
  options: MatchArraySetOptions,
): boolean {
  if (options?.mayNotContains && options?.mayNotContained) {
    throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`)
  }

  function addValue(map: Map<any, T[]> | null, key: any, value: T): Map<any, T[]> {
    let values: T[]
    if (!map) {
      map = new Map()
    }
    else {
      values = map.get(key)
    }

    if (!values) {
      map.set(key, [value])
    }
    else {
      values.push(value)
    }

    return map
  }

  let expectedMap: Map<any, T[]>
  for (let i = 0, len = expected.length; i < len; i++) {
    const expectedItem = expected[i]
    const key = getKey(expectedItem)
    expectedMap = addValue(expectedMap, key, expectedItem)
  }

  let actualMap: Map<any, T[]>
  for (let i = 0, len = actual.length; i < len; i++) {
    const actualItem = actual[i]
    const key = getKey(actualItem)
    actualMap = addValue(actualMap, key, actualItem)
  }

  let actualFoundMap: Map<any, T[]>
  let expectedFoundMap: Map<any, T[]>

  function f1(
    actualKey: any,
    expectedKey: any,
    actualValues: T[],
    expectedValues: T[],
  ) {
    if (expectedValues?.length && actualValues?.length) {
      let actualIndex = 0
      while (actualIndex < actualValues.length && expectedValues.length > 0) {
        const actualValue = actualValues[actualIndex]
        let expectedIndex = 0
        while (expectedIndex < expectedValues.length) {
          const expectedValue = expectedValues[expectedIndex]
          if (match(actualValue, expectedValue)) {
            actualValues[actualIndex] = actualValues[actualValues.length - 1]
            actualValues.length--
            expectedValues[expectedIndex] = expectedValues[expectedValues.length - 1]
            expectedValues.length--
            if (actualValues.length === 0) {
              actualMap.delete(actualKey)
            }
            if (expectedValues.length === 0) {
              expectedMap.delete(expectedKey)
            }
            actualFoundMap = addValue(actualFoundMap, actualKey, actualValue)
            expectedFoundMap = addValue(expectedFoundMap, expectedKey, expectedValue)
            actualIndex--
            break
          }
          expectedIndex++
        }
        actualIndex++
      }
    }
  }

  if (!options?.mayNotContains && actualMap?.size && expectedMap?.size) {
    actualMap.forEach((actualValues, actualKey) => {
      if (actualKey === ANY) {
        for (const [expectedKey, expectedValues] of expectedMap) {
          f1(ANY, expectedKey, actualValues, expectedValues)
          if (actualValues.length === 0) {
            break
          }
        }
      }
      else {
        let expectedValues = expectedMap.get(actualKey)
        f1(actualKey, actualKey, actualValues, expectedValues)
        if (actualValues.length > 0) {
          expectedValues = expectedMap.get(ANY)
          f1(actualKey, ANY, actualValues, expectedValues)
        }
      }
    })
  }

  if (!options?.mayNotContained && actualMap?.size && expectedMap?.size) {
    expectedMap.forEach((expectedValues, expectedKey) => {
      if (expectedKey === ANY) {
        for (const [actualKey, actualValues] of actualMap) {
          f1(actualKey, ANY, actualValues, expectedValues)
          if (expectedValues.length === 0) {
            break
          }
        }
      }
      else {
        let actualValues = actualMap.get(expectedKey)
        f1(expectedKey, expectedKey, actualValues, expectedValues)
        if (expectedValues.length > 0) {
          actualValues = actualMap.get(ANY)
          f1(ANY, expectedKey, actualValues, expectedValues)
        }
      }
    })
  }

  function f2(
    actualValues: T[],
    expectedValues: T[],
  ) {
    for (let i = 0, len = actualValues.length; i < len; i++) {
      const actualItem = actualValues[i]
      let found = false
      for (let j = 0, len = expectedValues.length; j < len; j++) {
        const expectedItem = expectedValues[j]
        if (match(actualItem, expectedItem)) {
          found = true
          break
        }
      }
      if (!found) {
        return false
      }
    }
    return true
  }

  if (actualMap?.size) {
    if (options?.mayNotContained) {
      return true
    }

    if (options?.actualRepeats) {
      if (!expectedFoundMap) {
        return false
      }
      for (const [actualKey, actualValues] of actualMap) {
        if (actualKey === ANY) {
          let found = false
          for (const [, expectedValues] of expectedFoundMap) {
            if (f2(actualValues, expectedValues)) {
              found = true
              break
            }
          }
          if (!found) {
            return false
          }
        }
        else {
          let expectedValues = expectedFoundMap?.get(actualKey)
          let found = false
          if (expectedValues && f2(actualValues, expectedValues)) {
            found = true
          }
          if (!found) {
            expectedValues = expectedFoundMap?.get(ANY)
            if (expectedValues && f2(actualValues, expectedValues)) {
              found = true
            }
          }
          if (!found) {
            return false
          }
        }
      }
    }
    else {
      return false
    }
  }

  if (expectedMap?.size) {
    if (options?.mayNotContains) {
      return true
    }

    if (options?.expectedRepeats) {
      if (!actualFoundMap) {
        return false
      }
      for (const [expectedKey, expectedValues] of expectedMap) {
        if (expectedKey === ANY) {
          let found = false
          for (const [, actualValues] of actualFoundMap) {
            if (f2(expectedValues, actualValues)) {
              found = true
              break
            }
          }
          if (!found) {
            return false
          }
        }
        else {
          let actualValues = actualFoundMap?.get(expectedKey)
          let found = false
          if (actualValues && f2(expectedValues, actualValues)) {
            found = true
          }
          if (!found) {
            actualValues = actualFoundMap?.get(ANY)
            if (actualValues && f2(expectedValues, actualValues)) {
              found = true
            }
          }
          if (!found) {
            return false
          }
        }
      }
    }
    else {
      return false
    }
  }

  return true
}
