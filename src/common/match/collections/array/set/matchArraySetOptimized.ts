import {MatchArraySetOptions} from './contracts'
import {MatchResult, MatchResult2} from 'src/common/match/contracts'

export function matchArraySetOptimized<T>(
  actual: T[],
  expected: T[],
  isMatcher: (value: any) => boolean,
  match: (actual: T, expected: T) => MatchResult<T>,
  options: MatchArraySetOptions,
): MatchResult2 {
  if (options?.mayNotContains && options?.mayNotContained) {
    throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`)
  }

  let expectedMap: Map<T, number>
  let expectedMatcherMap: Map<T, number>
  for (let i = 0, len = expected.length; i < len; i++) {
    const expectedItem = expected[i]
    let count: number
    if (isMatcher(expectedItem)) {
      if (!expectedMatcherMap) {
        expectedMatcherMap = new Map()
        count = 1
      }
      else {
        count = (expectedMatcherMap.get(expectedItem) || 0) + 1
      }
      expectedMatcherMap.set(expectedItem, count)
    }
    else {
      if (!expectedMap) {
        expectedMap = new Map()
        count = 1
      }
      else {
        count = (expectedMap.get(expectedItem) || 0) + 1
      }
      expectedMap.set(expectedItem, count)
    }
  }

  let actualMap: Map<T, number>
  let actualMatcherMap: Map<T, number>
  for (let i = 0, len = actual.length; i < len; i++) {
    const actualItem = actual[i]
    let count: number
    if (isMatcher(actualItem)) {
      if (!actualMatcherMap) {
        actualMatcherMap = new Map()
        count = 1
      }
      else {
        count = (actualMatcherMap.get(actualItem) || 0) + 1
      }
      actualMatcherMap.set(actualItem, count)
    }
    else {
      if (!actualMap) {
        actualMap = new Map()
        count = 1
      }
      else {
        count = (actualMap.get(actualItem) || 0) + 1
      }
      actualMap.set(actualItem, count)
    }
  }

  const actualFoundMatcherSet = actualMatcherMap && new Set<T>()
  const expectedFoundMatcherSet = expectedMatcherMap && new Set<T>()
  const actualFoundValuesSet = actualMap && new Set<T>()
  const expectedFoundValuesSet = expectedMap && new Set<T>()

  function f1(
    actualItem,
    actualCount,
    actualMap,
    expectedMap,
    actualFoundMatcherSet,
    expectedFoundMatcherSet,
    actualFoundValuesSet,
    expectedFoundValuesSet,
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
        actualFoundValuesSet.add(actualItem)
        expectedFoundValuesSet.add(actualItem)
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
    actualFoundValuesSet,
    expectedFoundValuesSet,
  ) {
    while (actualCount > 0) {
      let found = false
      for (let [expectedItem, expectedCount] of expectedMap) {
        if (expectedCount > 0) {
          const matchResult = match(actualItem, expectedItem)
          if (matchResult.result) {
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
              actualFoundValuesSet.add(actualItem)
            }
            if (isMatcher(expectedItem)) {
              expectedFoundMatcherSet.add(expectedItem)
            }
            else {
              expectedFoundValuesSet.add(expectedItem)
            }
            found = true
            break
          }
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

  if (!options?.mayNotContains) {
    actualMap?.forEach((actualCount, actualItem) => {
      if (actualCount && expectedMap) {
        actualCount = f1(
          actualItem,
          actualCount,
          actualMap,
          expectedMap,
          actualFoundMatcherSet,
          expectedFoundMatcherSet,
          actualFoundValuesSet,
          expectedFoundValuesSet,
        )
      }
      // if (actualCount && expectedMatcherMap) {
      //   f1(
      //     actualItem, actualCount,
      //     actualMap, expectedMatcherMap,
      //     actualFoundMatcherSet, expectedFoundMatcherSet,
      //     actualFoundValuesSet, expectedFoundValuesSet,
      //   )
      // }
    })
    actualMatcherMap?.forEach((actualCount, actualItem) => {
      // if (expectedMap) {
      //   actualCount = f1(
      //     actualItem, actualCount,
      //     actualMatcherMap, expectedMap,
      //     actualFoundMatcherSet, expectedFoundMatcherSet,
      //     actualFoundValuesSet, expectedFoundValuesSet,
      //   )
      // }
      if (actualCount && expectedMatcherMap) {
        f1(
          actualItem,
          actualCount,
          actualMatcherMap,
          expectedMatcherMap,
          actualFoundMatcherSet,
          expectedFoundMatcherSet,
          actualFoundValuesSet,
          expectedFoundValuesSet,
        )
      }
    })

    actualMap?.forEach((actualCount, actualItem) => {
      // if (expectedMap) {
      //   actualCount = f2(
      //     actualItem, actualCount,
      //     actualMap, expectedMap,
      //     actualFoundMatcherSet, expectedFoundMatcherSet,
      //     actualFoundValuesSet, expectedFoundValuesSet,
      //   )
      // }
      if (actualCount && expectedMatcherMap) {
        f2(
          actualItem,
          actualCount,
          actualMap,
          expectedMatcherMap,
          actualFoundMatcherSet,
          expectedFoundMatcherSet,
          actualFoundValuesSet,
          expectedFoundValuesSet,
        )
      }
    })
    actualMatcherMap?.forEach((actualCount, actualItem) => {
      if (actualCount && expectedMap) {
        actualCount = f2(
          actualItem,
          actualCount,
          actualMatcherMap,
          expectedMap,
          actualFoundMatcherSet,
          expectedFoundMatcherSet,
          actualFoundValuesSet,
          expectedFoundValuesSet,
        )
      }
      if (actualCount && expectedMatcherMap) {
        f2(
          actualItem,
          actualCount,
          actualMatcherMap,
          expectedMatcherMap,
          actualFoundMatcherSet,
          expectedFoundMatcherSet,
          actualFoundValuesSet,
          expectedFoundValuesSet,
        )
      }
    })
  }

  if (!options?.mayNotContained) {
    expectedMap?.forEach((expectedCount, expectedItem) => {
      if (expectedCount && actualMap) {
        expectedCount = f1(
          expectedItem,
          expectedCount,
          expectedMap,
          actualMap,
          expectedFoundMatcherSet,
          actualFoundMatcherSet,
          expectedFoundValuesSet,
          actualFoundValuesSet,
        )
      }
      // if (expectedCount && actualMatcherMap) {
      //   f1(
      //     expectedItem, expectedCount,
      //     expectedMap, actualMatcherMap,
      //     expectedFoundMatcherSet, actualFoundMatcherSet,
      //     expectedFoundValuesSet, actualFoundValuesSet,
      //   )
      // }
    })
    expectedMatcherMap?.forEach((expectedCount, expectedItem) => {
      // if (actualMap) {
      //   expectedCount = f1(
      //     expectedItem, expectedCount,
      //     expectedMatcherMap, actualMap,
      //     expectedFoundMatcherSet, actualFoundMatcherSet,
      //     expectedFoundValuesSet, actualFoundValuesSet,
      //   )
      // }
      if (expectedCount && actualMatcherMap) {
        f1(
          expectedItem,
          expectedCount,
          expectedMatcherMap,
          actualMatcherMap,
          expectedFoundMatcherSet,
          actualFoundMatcherSet,
          expectedFoundValuesSet,
          actualFoundValuesSet,
        )
      }
    })

    expectedMap?.forEach((expectedCount, expectedItem) => {
      // if (actualMap) {
      //   expectedCount = f2(
      //     expectedItem, expectedCount,
      //     expectedMap, actualMap,
      //     expectedFoundMatcherSet, actualFoundMatcherSet,
      //     expectedFoundValuesSet, actualFoundValuesSet,
      //   )
      // }
      if (expectedCount && actualMatcherMap) {
        f2(
          expectedItem,
          expectedCount,
          expectedMap,
          actualMatcherMap,
          expectedFoundMatcherSet,
          actualFoundMatcherSet,
          expectedFoundValuesSet,
          actualFoundValuesSet,
        )
      }
    })
    expectedMatcherMap?.forEach((expectedCount, expectedItem) => {
      if (expectedCount && actualMap) {
        expectedCount = f2(
          expectedItem,
          expectedCount,
          expectedMatcherMap,
          actualMap,
          expectedFoundMatcherSet,
          actualFoundMatcherSet,
          expectedFoundValuesSet,
          actualFoundValuesSet,
        )
      }
      if (expectedCount && actualMatcherMap) {
        f2(
          expectedItem,
          expectedCount,
          expectedMatcherMap,
          actualMatcherMap,
          expectedFoundMatcherSet,
          actualFoundMatcherSet,
          expectedFoundValuesSet,
          actualFoundValuesSet,
        )
      }
    })
  }

  let actualFoundMatcherArray: T[]
  let expectedFoundMatcherArray: T[]
  let actualFoundValuesArray: T[]
  let expectedFoundValuesArray: T[]

  function f4(
    actualItem,
    expectedFoundSet,
  ) {
    let found = false
    // if (Array.isArray(expectedFoundSet)) {
    for (let i = 0, len = expectedFoundSet.length; i < len; i++) {
      const expectedItem = expectedFoundSet[i]
      const matchResult = match(actualItem, expectedItem)
      if (matchResult.result) {
        found = true
        break
      }
    }
    // }
    // else {
    //   for (const expectedItem of expectedFoundSet) {
    //     const matchResult = match(actualItem, expectedItem)
    //     if (matchResult.result) {
    //       found = true
    //       break
    //     }
    //   }
    // }
    return found
  }

  if (actualMap?.size || actualMatcherMap?.size) {
    if (options?.mayNotContained) {
      return {
        result: true,
        nested: null,
      }
    }

    if (options?.actualRepeats) {
      if (actualMap) {
        for (const [actualItem] of actualMap) {
          if (expectedFoundValuesSet?.has(actualItem)) {
            break
          }

          let found = false
          // if (isMatcher(actualItem) && expectedFoundValuesSet) {
          //   found = f4(actualItem, expectedFoundValuesSet)
          // }
          if (!found && expectedFoundMatcherSet) {
            if (!expectedFoundMatcherArray) {
              expectedFoundMatcherArray = Array.from(expectedFoundMatcherSet)
            }
            found = f4(actualItem, expectedFoundMatcherArray)
          }

          if (!found) {
            return {
              result: false,
              nested: null,
            }
          }
        }
      }
      if (actualMatcherMap) {
        for (const [actualItem] of actualMatcherMap) {
          // if (expectedFoundValuesSet?.has(actualItem)) {
          //   break
          // }

          let found = false
          if (isMatcher(actualItem) && expectedFoundValuesSet) {
            if (!expectedFoundValuesArray) {
              expectedFoundValuesArray = Array.from(expectedFoundValuesSet)
            }
            found = f4(actualItem, expectedFoundValuesArray)
          }
          if (!found && expectedFoundMatcherSet) {
            if (!expectedFoundMatcherArray) {
              expectedFoundMatcherArray = Array.from(expectedFoundMatcherSet)
            }
            found = f4(actualItem, expectedFoundMatcherArray)
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

  if (expectedMap?.size || expectedMatcherMap?.size) {
    if (options?.mayNotContains) {
      return {
        result: true,
        nested: null,
      }
    }

    if (options?.expectedRepeats) {
      if (expectedMap) {
        for (const [expectedItem] of expectedMap) {
          if (actualFoundValuesSet?.has(expectedItem)) {
            break
          }

          let found = false
          // if (isMatcher(expectedItem) && actualFoundValuesSet) {
          //   found = f4(expectedItem, actualFoundValuesSet)
          // }
          if (!found && actualFoundMatcherSet) {
            if (!actualFoundMatcherArray) {
              actualFoundMatcherArray = Array.from(actualFoundMatcherSet)
            }
            found = f4(expectedItem, actualFoundMatcherArray)
          }

          if (!found) {
            return {
              result: false,
              nested: null,
            }
          }
        }
      }
      if (expectedMatcherMap) {
        for (const [expectedItem] of expectedMatcherMap) {
          // if (actualFoundValuesSet?.has(expectedItem)) {
          //   break
          // }

          let found = false
          if (isMatcher(expectedItem) && actualFoundValuesSet) {
            if (!actualFoundValuesArray) {
              actualFoundValuesArray = Array.from(actualFoundValuesSet)
            }
            found = f4(expectedItem, actualFoundValuesArray)
          }
          if (!found && actualFoundMatcherSet) {
            if (!actualFoundMatcherArray) {
              actualFoundMatcherArray = Array.from(actualFoundMatcherSet)
            }
            found = f4(expectedItem, actualFoundMatcherArray)
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
    nested: null,
  }
}
