import {MatchArraySetOptions} from './contracts'
import {ANY, MatchResult, MatchResult2, MatchResultNested, UNSET} from 'src/common/match/contracts'

export function matchArrayMapOptimized<T>(
  actual: T[],
  expected: T[],
  getKey: (value: T) => any,
  match: (actual: T, expected: T) => MatchResult<number>,
  options: MatchArraySetOptions,
): MatchResult2 {
  if (options?.mayNotContains && options?.mayNotContained) {
    throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`)
  }

  type IndexValue<T> = {
    index: number
    value: T
  }

  function addValue(
    map: Map<any, IndexValue<T>[]> | null,
    key: any,
    indexValue: IndexValue<T>,
  ): Map<any, IndexValue<T>[]> {
    let indexValues: IndexValue<T>[]
    if (!map) {
      map = new Map()
    }
    else {
      indexValues = map.get(key)
    }

    if (!indexValues) {
      map.set(key, [indexValue])
    }
    else {
      indexValues.push(indexValue)
    }

    return map
  }

  let expectedMap: Map<any, IndexValue<T>[]>
  for (let i = 0, len = expected.length; i < len; i++) {
    const expectedItem = expected[i]
    const key = getKey(expectedItem)
    expectedMap = addValue(expectedMap, key, {
      index: i,
      value: expectedItem,
    })
  }

  let actualMap: Map<any, IndexValue<T>[]>
  for (let i = 0, len = actual.length; i < len; i++) {
    const actualItem = actual[i]
    const key = getKey(actualItem)
    actualMap = addValue(actualMap, key, {
      index: i,
      value: actualItem,
    })
  }

  let actualFoundMap: Map<any, IndexValue<T>[]>
  let expectedFoundMap: Map<any, IndexValue<T>[]>
  const nestedTrue: MatchResultNested[] = []

  function f1(
    actualKey: any,
    expectedKey: any,
    actualValues: IndexValue<T>[],
    expectedValues: IndexValue<T>[],
  ) {
    if (expectedValues?.length && actualValues?.length) {
      let actualIndex = 0
      while (actualIndex < actualValues.length && expectedValues.length > 0) {
        const actualValue = actualValues[actualIndex]
        let expectedIndex = 0
        while (expectedIndex < expectedValues.length) {
          const expectedValue = expectedValues[expectedIndex]
          const matchResult = match(actualValue.value, expectedValue.value)
          if (matchResult.result) {
            nestedTrue.push({
              actualKey  : actualIndex,
              expectedKey: expectedIndex,
              result     : matchResult,
            })
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
    actualMap: Map<any, IndexValue<T>[]>,
    actualKey: any,
    actualValues: IndexValue<T>[],
    expectedValues: IndexValue<T>[],
    isViceVersa: boolean,
  ) {
    for (let i = 0, len = actualValues.length; i < len; i++) {
      const actualItem = actualValues[i]
      let found = false
      for (let j = 0, len = expectedValues.length; j < len; j++) {
        const expectedItem = expectedValues[j]
        const matchResult = isViceVersa
          ? match(expectedItem.value, actualItem.value)
          : match(actualItem.value, expectedItem.value)
        if (matchResult.result) {
          nestedTrue.push({
            actualKey  : isViceVersa ? j : i,
            expectedKey: isViceVersa ? i : j,
            result     : matchResult,
          })
          found = true
          actualValues[i] = actualValues[actualValues.length - 1]
          actualValues.length--
          if (actualValues.length === 0) {
            actualMap.delete(actualKey)
          }
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
      return {
        result: true,
        nested: nestedTrue,
      }
    }

    if (options?.actualRepeats) {
      if (!expectedFoundMap) {
        const firstActualEntry: [any, IndexValue<T>[]] = actualMap.entries().next().value
        return {
          result: false,
          nested: [{
            actualKey  : firstActualEntry[1][0].index,
            expectedKey: UNSET,
            result     : {
              actual  : firstActualEntry[1][0].value,
              expected: UNSET,
              result  : false,
              cause   : null,
              nested  : null,
              error   : null,
            },
          }],
        }
      }
      for (const [actualKey, actualValues] of actualMap) {
        if (actualKey === ANY) {
          let found = false
          for (const [, expectedValues] of expectedFoundMap) {
            if (f2(actualMap, actualKey, actualValues, expectedValues, false)) {
              found = true
              break
            }
          }
          if (!found) {
            return {
              result: false,
              nested: [{
                actualKey  : actualValues[0].index,
                expectedKey: UNSET,
                result     : {
                  actual  : actualValues[0].value,
                  expected: UNSET,
                  result  : false,
                  cause   : null,
                  nested  : null,
                  error   : null,
                },
              }],
            }
          }
        }
        else {
          let expectedValues = expectedFoundMap?.get(actualKey)
          let found = false
          if (expectedValues && f2(actualMap, actualKey, actualValues, expectedValues, false)) {
            found = true
          }
          if (!found) {
            expectedValues = expectedFoundMap?.get(ANY)
            if (expectedValues && f2(actualMap, actualKey, actualValues, expectedValues, false)) {
              found = true
            }
          }
          if (!found) {
            return {
              result: false,
              nested: [{
                actualKey  : actualValues[0].index,
                expectedKey: UNSET,
                result     : {
                  actual  : actualValues[0].value,
                  expected: UNSET,
                  result  : false,
                  cause   : null,
                  nested  : null,
                  error   : null,
                },
              }],
            }
          }
        }
      }
    }
    else {
      return {
        result: false,
        nested: null,
      }
    }
  }

  if (expectedMap?.size) {
    if (options?.mayNotContains) {
      return {
        result: true,
        nested: nestedTrue,
      }
    }

    if (options?.expectedRepeats) {
      if (!actualFoundMap) {
        return {
          result: false,
          nested: null,
        }
      }
      for (const [expectedKey, expectedValues] of expectedMap) {
        if (expectedKey === ANY) {
          let found = false
          for (const [, actualValues] of actualFoundMap) {
            if (f2(expectedMap, expectedKey, expectedValues, actualValues, true)) {
              found = true
              break
            }
          }
          if (!found) {
            return {
              result: false,
              nested: null,
            }
          }
        }
        else {
          let actualValues = actualFoundMap?.get(expectedKey)
          let found = false
          if (actualValues && f2(expectedMap, expectedKey, expectedValues, actualValues, true)) {
            found = true
          }
          if (!found) {
            actualValues = actualFoundMap?.get(ANY)
            if (actualValues && f2(expectedMap, expectedKey, expectedValues, actualValues, true)) {
              found = true
            }
          }
          if (!found) {
            return {
              result: false,
              nested: null,
            }
          }
        }
      }
    }
    else {
      return {
        result: false,
        nested: null,
      }
    }
  }

  return {
    result: true,
    nested: nestedTrue,
  }
}
