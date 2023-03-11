/* eslint-disable array-element-newline */
import {createTestVariants} from '@flemist/test-variants'
import {calcPerformance} from 'rdtsc'

type MatchArraySetOptions = {
  mayNotContains?: boolean
  mayNotContained?: boolean
  actualRepeats?: boolean
  expectedRepeats?: boolean
}

function matchArraySetOld<T>(
  actual: T[], expected: T[],
  match: (actual: T, expected: T) => boolean,
  options: MatchArraySetOptions,
): boolean {
  if (options?.mayNotContains && options?.mayNotContained) {
    throw new Error(`At least one of the options 'mayNotContains' or 'mayNotContained' should be false`)
  }

  let actualValues = actual.slice()
  let expectedValues = expected.slice()
  let actualFound = []
  let expectedFound = []

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

function matchArraySet<T>(
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
    for (let i = 0, len = expectedFoundSet.length; i < len; i++) {
      const expectedItem = expectedFoundSet[i]
      if (match(actualItem, expectedItem)) {
        found = true
        break
      }
    }
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
            return true
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
          //   return true
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
            return true
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
          //   return true
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

function addRepeats(arr: number[], index: number, count: number) {
  const result = [...arr]
  for (let i = 0; i < count; i++) {
    result.splice(index, 0, arr[index])
  }
  return result
}

function addBreaks(arr: number[], index: number, count: number) {
  const result = [...arr]
  for (let i = 0; i < count; i++) {
    result.splice(index, 0, 0)
  }
  return result
}

describe('matchArraySet', function () {
  function match(actual: any, expected: any) {
    if (typeof actual === 'object') {
      actual = actual.value
    }
    if (typeof expected === 'object') {
      expected = expected.value
    }
    return actual === expected
  }

  const testVariants = createTestVariants(({
    actual,
    expected,
    result,
    mayNotContains,
    mayNotContained,
    actualRepeats,
    expectedRepeats,
  }: {
    actual: any[]
    expected: any[]
    result: boolean
    mayNotContains?: boolean
    mayNotContained?: boolean
    actualRepeats?: boolean
    expectedRepeats?: boolean
  }) => {
    // console.log(actual)
    // console.log(expected, result)
    // console.log()
    const resultActual = matchArraySet(actual, expected, match, {
      mayNotContains,
      mayNotContained,
      actualRepeats,
      expectedRepeats,
    })
    assert.strictEqual(resultActual, result)
  })

  it('simple', async function () {
    assert.throws(() => matchArraySet([], [], match, {mayNotContains: true, mayNotContained: true}),
      /At least one of the options 'mayNotContains' or 'mayNotContained' should be false/)
  })

  it('variants', async function () {
    await testVariants<{
      resultFalseType: string
      values: number[]
      actualValues: number[]
      expectedValues: number[]
      actualRepeatsValues: number[]
      expectedRepeatsValues: number[]
      mayNotContainsValues: number[]
      mayNotContainedValues: number[]
      expectedShuffle: number[]
    }>({
      result         : [true, false],
      mayNotContains : [false, true],
      mayNotContained: ({mayNotContains}) => mayNotContains ? [false] : [false, true],
      actualRepeats  : [false, true],
      expectedRepeats: [false, true],
      resultFalseType: ({
        result,
        mayNotContains, mayNotContained,
        actualRepeats, expectedRepeats,
      }) => result
        ? ['']
        : [
          'actual',
          'expected',
          ...!mayNotContains ? ['mayNotContains'] : [],
          ...!mayNotContained ? ['mayNotContained'] : [],
          ...!actualRepeats ? ['actualRepeats'] : [],
          ...!expectedRepeats ? ['expectedRepeats'] : [],
        ],
      values      : () => [[], [1], [1, 2], [1, 2, 1], [1, 2, 1, 2], [1, 2, 3], [1, 1, 2, 2]],
      actualValues: ({
        result, resultFalseType, values, mayNotContains, mayNotContained, expectedRepeats,
      }) => values.length === 0 ? [] : [
        ...!result && resultFalseType === 'actual'
          ? [
            ...values.length > 1 && !mayNotContains
              ? [
                values.filter(o => o !== values[0]),
                values.filter(o => o !== values[values.length - 1]),
              ]
              : [],
            ...values.length > 1 && !mayNotContains && !expectedRepeats
              ? [
                values.slice(1),
                values.slice(0, values.length - 1),
              ]
              : [],
          ]
          : [values],
      ],
      actualRepeatsValues: ({
        result, resultFalseType, mayNotContains, mayNotContained, actualValues: values, actualRepeats,
      }) => [
        ...result || resultFalseType !== 'actualRepeats'
          ? [values]
          : [],
        ...resultFalseType === 'actualRepeats' && !mayNotContained
          || result && actualRepeats && values.length > 0
          ? [
            [values[values.length - 1], ...values],
            [...values, values[0]],
          ]
          : [],
      ],
      mayNotContainedValues: ({
        result, resultFalseType, mayNotContains, mayNotContained, actualRepeatsValues: values, expectedRepeats,
      }) => [
        ...result || resultFalseType !== 'mayNotContained'
          ? [values]
          : [],
        ...resultFalseType === 'mayNotContained' || result && mayNotContained && values.length > 0
          ? [
            [0, ...values],
            [...values, 0],
          ]
          : [],
      ],
      expectedValues: ({
        result, resultFalseType, values, mayNotContains, mayNotContained, actualRepeats,
      }) => values.length === 0 ? [] : [
        ...!result && resultFalseType === 'expected'
          ? [
            ...values.length > 1 && !mayNotContained
              ? [
                values.filter(o => o !== values[0]),
                values.filter(o => o !== values[values.length - 1]),
              ]
              : [],
            ...values.length > 1 && !mayNotContained && !actualRepeats
              ? [
                values.slice(1),
                values.slice(0, values.length - 1),
              ]
              : [],
          ]
          : [values],
      ],
      expectedRepeatsValues: ({
        result, resultFalseType, mayNotContains, mayNotContained, expectedValues: values, expectedRepeats,
      }) => [
        ...result || resultFalseType !== 'expectedRepeats'
          ? [values]
          : [],
        ...resultFalseType === 'expectedRepeats' && !mayNotContains
          || result && expectedRepeats && values.length > 0
          ? [
            [values[values.length - 1], ...values],
            [...values, values[0]],
          ]
          : [],
      ],
      mayNotContainsValues: ({
        result, resultFalseType, mayNotContains, mayNotContained, expectedRepeatsValues: values, expectedRepeats,
      }) => [
        ...result || resultFalseType !== 'mayNotContains'
          ? [values]
          : [],
        ...resultFalseType === 'mayNotContains' || result && mayNotContains && values.length > 0
          ? [
            [0, ...values],
            [...values, 0],
          ]
          : [],
      ],
      expectedShuffle: ({mayNotContainsValues: values}) => [
        values,
        values.reverse(),
        values.sort((a, b) => Math.random() - 0.5),
      ],
      actual: ({mayNotContainedValues: values}) => [
        values,
        values.map((o, i) => i % 2 === 0 ? o : {value: o}),
        values.map((o, i) => i % 2 !== 0 ? o : {value: o}),
        values.map(o => ({value: o})),
      ],
      expected: ({mayNotContainsValues: values}) => [
        values,
        values.map((o, i) => i % 2 === 0 ? o : {value: o}),
        values.map((o, i) => i % 2 !== 0 ? o : {value: o}),
        values.map(o => ({value: o})),
      ],
    })()
  })

  it('perf', function () {
    const actual = [
      {value: 1}, 2, 4,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
    ]
    const expected = [
      1, {value: 2}, 3,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
    ]
    const result = calcPerformance(
      1000,
      () => {

      },
      () => {
        matchArraySetOld(actual, expected, match, {
          mayNotContains : true,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySetOld(actual, expected, match, {
          mayNotContains : false,
          mayNotContained: true,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySetOld(actual, expected, match, {
          mayNotContains : false,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
      },
      () => {
        matchArraySet(actual, expected, match, {
          mayNotContains : true,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySet(actual, expected, match, {
          mayNotContains : false,
          mayNotContained: true,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySet(actual, expected, match, {
          mayNotContains : false,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
      },
    )

    console.log('perf iterations: ' + result.calcInfo.iterations)
    console.log(Math.round((result.relativeDiff[0] - 1) * 100) + '%')
  })
})
