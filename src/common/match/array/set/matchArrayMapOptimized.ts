import {MatchArraySetOptions} from './contracts'

export function matchArrayMapOptimized<T>(
  actual: T[],
  expected: T[],
  isMatcher: (value: any) => boolean,
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
    actualItem,
    actualCount,
    actualMap,
    expectedMap,
    actualFoundMatcherSet,
    expectedFoundMatcherSet,
    actualFoundMap,
    expectedFoundMap,
  ) {
    let expectedCount = expectedMap?.get(actualItem)
    if (expectedCount) {
      const minCount = Math.min(actualCount, expectedCount)
      expectedCount -= minCount
      actualCount -= minCount
      if (!expectedCount) {
        expectedMap.delete(actualItem)
      }
      else {
        expectedMap.set(actualItem, expectedCount)
      }
      if (typeof actualItem !== 'object') {
        actualFoundMap.add(actualItem)
        expectedFoundMap.add(actualItem)
      }
    }
    if (!actualCount) {
      actualMap.delete(actualItem)
      return actualCount
    }
    actualMap.set(actualItem, actualCount)
    return actualCount
  }

  function f2(
    actualItem,
    actualCount,
    actualMap,
    expectedMap,
    actualFoundMatcherSet,
    expectedFoundMatcherSet,
    actualFoundMap,
    expectedFoundMap,
  ) {
    while (actualCount > 0) {
      let found = false
      for (let [expectedItem, expectedCount] of expectedMap) {
        if (expectedCount > 0 && match(actualItem, expectedItem)) {
          expectedCount--
          if (!expectedCount) {
            expectedMap.delete(expectedItem)
          }
          else {
            expectedMap.set(expectedItem, expectedCount)
          }
          actualCount--
          if (isMatcher(actualItem)) {
            actualFoundMatcherSet.add(actualItem)
          }
          else {
            actualFoundMap.add(actualItem)
          }
          if (isMatcher(expectedItem)) {
            expectedFoundMatcherSet.add(expectedItem)
          }
          else {
            expectedFoundMap.add(expectedItem)
          }
          found = true
          break
        }
      }
      if (!found) {
        break
      }
    }
    if (!actualCount) {
      actualMap.delete(actualItem)
    }
    else {
      actualMap.set(actualItem, actualCount)
    }
    return actualCount
  }

  if (!options?.mayNotContains && actualMap?.size && expectedMap?.size) {
    actualMap.forEach((actualValues, actualKey) => {
      const expectedValues = expectedMap.get(actualKey)
      if (expectedValues?.length) {
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
                expectedMap.delete(actualKey)
              }
              actualFoundMap = addValue(actualFoundMap, actualKey, actualValue)
              expectedFoundMap = addValue(expectedFoundMap, actualKey, expectedValue)
              break
            }
            expectedIndex++
          }
          if (expectedIndex === expectedValues.length) {
            actualIndex++
          }
        }
      }
    })
  }

  if (!options?.mayNotContained && actualMap?.size && expectedMap?.size) {
    expectedMap.forEach((expectedValues, expectedKey) => {
      const actualValues = actualMap.get(expectedKey)
      if (actualValues?.length) {
        let expectedIndex = 0
        while (expectedIndex < expectedValues.length && actualValues.length > 0) {
          const expectedValue = expectedValues[expectedIndex]
          let actualIndex = 0
          while (actualIndex < actualValues.length) {
            const actualValue = actualValues[actualIndex]
            if (match(actualValue, expectedValue)) {
              expectedValues[expectedIndex] = expectedValues[expectedValues.length - 1]
              expectedValues.length--
              actualValues[actualIndex] = actualValues[actualValues.length - 1]
              actualValues.length--
              if (actualValues.length === 0) {
                actualMap.delete(expectedKey)
              }
              if (expectedValues.length === 0) {
                expectedMap.delete(expectedKey)
              }
              actualFoundMap = addValue(actualFoundMap, expectedKey, actualValue)
              expectedFoundMap = addValue(expectedFoundMap, expectedKey, expectedValue)
              break
            }
            actualIndex++
          }
          if (actualIndex === actualValues.length) {
            expectedIndex++
          }
        }
      }
    })
  }

  let actualFoundMatcherArray: T[]
  let expectedFoundMatcherArray: T[]
  let actualFoundArray: T[]
  let expectedFoundArray: T[]

  function f4(
    actualItem,
    expectedFoundMap,
  ) {
    let found = false
    // if (Array.isArray(expectedFoundMap)) {
    for (let i = 0, len = expectedFoundMap.length; i < len; i++) {
      const expectedItem = expectedFoundMap[i]
      if (match(actualItem, expectedItem)) {
        found = true
        break
      }
    }
    // }
    // else {
    //   for (const expectedItem of expectedFoundMap) {
    //     if (match(actualItem, expectedItem)) {
    //       found = true
    //       break
    //     }
    //   }
    // }
    return found
  }

  function f3(
    actualItem,
    actualFoundMatcherSet,
    expectedFoundMatcherSet,
    actualFoundMap,
    expectedFoundMap,
  ) {
    if (expectedFoundMap?.has(actualItem)) {
      return true
    }

    let found = false
    if (isMatcher(actualItem) && expectedFoundMap) {
      found = f4(actualItem, expectedFoundMap)
    }
    if (!found && expectedFoundMatcherSet) {
      found = f4(actualItem, expectedFoundMatcherSet)
    }

    return found
  }

  if (actualMap?.size) {
    if (options?.mayNotContained) {
      return true
    }

    if (options?.actualRepeats) {
      if (actualMap) {
        for (const [actualKey, actualValues] of actualMap) {
          const expectedValues = expectedFoundMap?.get(actualKey)
          if (!expectedValues) {
            return false
          }

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
      if (expectedMap) {
        for (const [expectedKey, expectedValues] of expectedMap) {
          const actualValues = actualFoundMap?.get(expectedKey)
          if (!actualValues) {
            return false
          }

          for (let i = 0, len = expectedValues.length; i < len; i++) {
            const expectedItem = expectedValues[i]
            let found = false
            for (let j = 0, len = actualValues.length; j < len; j++) {
              const actualItem = actualValues[j]
              if (match(actualItem, expectedItem)) {
                found = true
                break
              }
            }
            if (!found) {
              return false
            }
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
