import {createTestVariants} from '@flemist/test-variants'

type MatchArraySetOptions = {
  mayNotContains?: boolean
  mayNotContained?: boolean
  actualRepeats?: boolean
  expectedRepeats?: boolean
}

function matchArraySet(
  actual: number[], expected: number[],
  match: (actual: number, expected: number) => boolean,
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
  function match(actual: number, expected: number) {
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
    actual: number[]
    expected: number[]
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
      values      : () => [[], [1], [1, 2], [1, 2, 1], [1, 2, 1, 2], [1, 2, 3]],
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
      actual  : ({mayNotContainedValues: values}) => [values],
      expected: ({mayNotContainsValues: values}) => [values],
    })()
  })
})
