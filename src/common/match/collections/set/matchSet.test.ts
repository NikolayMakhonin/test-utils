/* eslint-disable array-element-newline */
import {createTestVariants} from '@flemist/test-variants'
import {matchSet} from './matchSet'

describe('matchSet', function () {
  const testVariants = createTestVariants(({
    matchFunc,
    actual,
    expected,
    result,
    mayNotContains,
    mayNotContained,
  }: {
    matchFunc: typeof matchSet
    actual: Set<any>
    expected: Set<any>
    result: boolean
    mayNotContains?: boolean
    mayNotContained?: boolean
  }) => {
    // console.log(actual)
    // console.log(expected, result)
    // console.log()
    const resultActual = matchSet(actual, expected, {
      mayNotContains,
      mayNotContained,
    })
    assert.strictEqual(resultActual, result)
  })

  it('simple', async function () {

  })

  it('variants', async function () {
    await testVariants<{
      resultFalseType: string
      values: number[]
      actualValues: number[]
      expectedValues: number[]
      mayNotContainsValues: number[]
      mayNotContainedValues: number[]
    }>({
      matchFunc      : [matchSet],
      result         : [true, false],
      mayNotContains : [false, true],
      mayNotContained: ({mayNotContains}) => mayNotContains ? [false] : [false, true],
      resultFalseType: ({
        result,
        mayNotContains, mayNotContained,
      }) => result
        ? ['']
        : [
          'actual',
          'expected',
          ...!mayNotContains ? ['mayNotContains'] : [],
          ...!mayNotContained ? ['mayNotContained'] : [],
        ],
      values      : () => [[], [1], [1, 2], [1, 2, 3]],
      actualValues: ({
        result, resultFalseType, values, mayNotContains, mayNotContained,
      }) => values.length === 0 ? [] : [
        ...!result && resultFalseType === 'actual'
          ? [
            ...values.length > 1 && !mayNotContains
              ? [
                values.filter(o => o !== values[0]),
                values.filter(o => o !== values[values.length - 1]),
              ]
              : [],
            ...values.length > 1 && !mayNotContains
              ? [
                values.slice(1),
                values.slice(0, values.length - 1),
              ]
              : [],
          ]
          : [values],
      ],
      mayNotContainedValues: ({
        result, resultFalseType, mayNotContains, mayNotContained, actualValues: values,
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
        result, resultFalseType, values, mayNotContains, mayNotContained,
      }) => values.length === 0 ? [] : [
        ...!result && resultFalseType === 'expected'
          ? [
            ...values.length > 1 && !mayNotContained
              ? [
                values.filter(o => o !== values[0]),
                values.filter(o => o !== values[values.length - 1]),
              ]
              : [],
            ...values.length > 1 && !mayNotContained
              ? [
                values.slice(1),
                values.slice(0, values.length - 1),
              ]
              : [],
          ]
          : [values],
      ],
      mayNotContainsValues: ({
        result, resultFalseType, mayNotContains, mayNotContained, expectedValues: values,
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
      actual: ({mayNotContainedValues: values}) => [
        new Set(values),
      ],
      expected: ({mayNotContainsValues: values}) => [
        new Set(values),
      ],
    })()
  })
})
