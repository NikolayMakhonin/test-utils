import {MatchArraySetOptions} from "./contracts";

export function matchArraySetOptimized<T>(
  actual: T[], expected: T[],
  match: (actual: T, expected: T) => boolean,
  options: MatchArraySetOptions,
): boolean {
  if (options?.mayNotContains && options?.mayNotContained) {
    throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`)
  }

  let expectedMap: Map<T, number>
  let expectedMatcherMap: Map<T, number>
  for (let i = 0, len = expected.length; i < len; i++) {
    const expectedItem = expected[i]
    let count: number
    if (typeof expectedItem === 'object') {
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
    if (typeof actualItem === 'object') {
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
    actualItem, actualCount,
    actualMap, expectedMap,
    actualFoundMatcherSet, expectedFoundMatcherSet,
    actualFoundValuesSet, expectedFoundValuesSet,
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
    actualItem, actualCount,
    actualMap, expectedMap,
    actualFoundMatcherSet, expectedFoundMatcherSet,
    actualFoundValuesSet, expectedFoundValuesSet,
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
          if (typeof actualItem === 'object') {
            actualFoundMatcherSet.add(actualItem)
          }
          else {
            actualFoundValuesSet.add(actualItem)
          }
          if (typeof expectedItem === 'object') {
            expectedFoundMatcherSet.add(expectedItem)
          }
          else {
            expectedFoundValuesSet.add(expectedItem)
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

  if (!options?.mayNotContains) {
    actualMap?.forEach((actualCount, actualItem) => {
      if (actualCount && expectedMap) {
        actualCount = f1(
          actualItem, actualCount,
          actualMap, expectedMap,
          actualFoundMatcherSet, expectedFoundMatcherSet,
          actualFoundValuesSet, expectedFoundValuesSet,
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
          actualItem, actualCount,
          actualMatcherMap, expectedMatcherMap,
          actualFoundMatcherSet, expectedFoundMatcherSet,
          actualFoundValuesSet, expectedFoundValuesSet,
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
          actualItem, actualCount,
          actualMap, expectedMatcherMap,
          actualFoundMatcherSet, expectedFoundMatcherSet,
          actualFoundValuesSet, expectedFoundValuesSet,
        )
      }
    })
    actualMatcherMap?.forEach((actualCount, actualItem) => {
      if (actualCount && expectedMap) {
        actualCount = f2(
          actualItem, actualCount,
          actualMatcherMap, expectedMap,
          actualFoundMatcherSet, expectedFoundMatcherSet,
          actualFoundValuesSet, expectedFoundValuesSet,
        )
      }
      if (actualCount && expectedMatcherMap) {
        f2(
          actualItem, actualCount,
          actualMatcherMap, expectedMatcherMap,
          actualFoundMatcherSet, expectedFoundMatcherSet,
          actualFoundValuesSet, expectedFoundValuesSet,
        )
      }
    })
  }

  if (!options?.mayNotContained) {
    expectedMap?.forEach((expectedCount, expectedItem) => {
      if (expectedCount && actualMap) {
        expectedCount = f1(
          expectedItem, expectedCount,
          expectedMap, actualMap,
          expectedFoundMatcherSet, actualFoundMatcherSet,
          expectedFoundValuesSet, actualFoundValuesSet,
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
          expectedItem, expectedCount,
          expectedMatcherMap, actualMatcherMap,
          expectedFoundMatcherSet, actualFoundMatcherSet,
          expectedFoundValuesSet, actualFoundValuesSet,
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
          expectedItem, expectedCount,
          expectedMap, actualMatcherMap,
          expectedFoundMatcherSet, actualFoundMatcherSet,
          expectedFoundValuesSet, actualFoundValuesSet,
        )
      }
    })
    expectedMatcherMap?.forEach((expectedCount, expectedItem) => {
      if (expectedCount && actualMap) {
        expectedCount = f2(
          expectedItem, expectedCount,
          expectedMatcherMap, actualMap,
          expectedFoundMatcherSet, actualFoundMatcherSet,
          expectedFoundValuesSet, actualFoundValuesSet,
        )
      }
      if (expectedCount && actualMatcherMap) {
        f2(
          expectedItem, expectedCount,
          expectedMatcherMap, actualMatcherMap,
          expectedFoundMatcherSet, actualFoundMatcherSet,
          expectedFoundValuesSet, actualFoundValuesSet,
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
      if (match(actualItem, expectedItem)) {
        found = true
        break
      }
    }
    // }
    // else {
    //   for (const expectedItem of expectedFoundSet) {
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
    actualFoundMatcherSet, expectedFoundMatcherSet,
    actualFoundValuesSet, expectedFoundValuesSet,
  ) {
    if (expectedFoundValuesSet?.has(actualItem)) {
      return true
    }

    let found = false
    if (typeof actualItem === 'object' && expectedFoundValuesSet) {
      found = f4(actualItem, expectedFoundValuesSet)
    }
    if (!found && expectedFoundMatcherSet) {
      found = f4(actualItem, expectedFoundMatcherSet)
    }

    return found
  }

  if (actualMap?.size || actualMatcherMap?.size) {
    if (options?.mayNotContained) {
      return true
    }

    if (options?.actualRepeats) {
      if (actualMap) {
        for (let [actualItem, actualCount] of actualMap) {
          if (expectedFoundValuesSet?.has(actualItem)) {
            break
          }

          let found = false
          // if (typeof actualItem === 'object' && expectedFoundValuesSet) {
          //   found = f4(actualItem, expectedFoundValuesSet)
          // }
          if (!found && expectedFoundMatcherSet) {
            if (!expectedFoundMatcherArray) {
              expectedFoundMatcherArray = Array.from(expectedFoundMatcherSet)
            }
            found = f4(actualItem, expectedFoundMatcherArray)
          }

          if (!found) {
            return false
          }
        }
      }
      if (actualMatcherMap) {
        for (let [actualItem, actualCount] of actualMatcherMap) {
          // if (expectedFoundValuesSet?.has(actualItem)) {
          //   break
          // }

          let found = false
          if (typeof actualItem === 'object' && expectedFoundValuesSet) {
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
            return false
          }
        }
      }
    }
    else {
      return false
    }
  }

  if (expectedMap?.size || expectedMatcherMap?.size) {
    if (options?.mayNotContains) {
      return true
    }

    if (options?.expectedRepeats) {
      if (expectedMap) {
        for (let [expectedItem, expectedCount] of expectedMap) {
          if (actualFoundValuesSet?.has(expectedItem)) {
            break
          }

          let found = false
          // if (typeof expectedItem === 'object' && actualFoundValuesSet) {
          //   found = f4(expectedItem, actualFoundValuesSet)
          // }
          if (!found && actualFoundMatcherSet) {
            if (!actualFoundMatcherArray) {
              actualFoundMatcherArray = Array.from(actualFoundMatcherSet)
            }
            found = f4(expectedItem, actualFoundMatcherArray)
          }

          if (!found) {
            return false
          }
        }
      }
      if (expectedMatcherMap) {
        for (let [expectedItem, expectedCount] of expectedMatcherMap) {
          // if (actualFoundValuesSet?.has(expectedItem)) {
          //   break
          // }

          let found = false
          if (typeof expectedItem === 'object' && actualFoundValuesSet) {
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