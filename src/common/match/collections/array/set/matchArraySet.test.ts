/* eslint-disable array-element-newline */
import {createTestVariants} from '@flemist/test-variants'
import {calcPerformance} from 'rdtsc'
import {matchArraySetSimple} from './matchArraySetSimple'
import {matchArraySetOptimized} from './matchArraySetOptimized'
import {matchArraySet, shouldUseOptimized} from './matchArraySet'
import {isMatcher, match} from '../../../test/helpers'

describe('matchArraySet', function () {
  const testVariants = createTestVariants(({
    matchFunc,
    actual,
    expected,
    result,
    mayNotContains,
    mayNotContained,
    actualRepeats,
    expectedRepeats,
  }: {
    matchFunc: typeof matchArraySetOptimized
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
    const resultActual = matchArraySetOptimized(actual, expected, isMatcher, match, {
      mayNotContains,
      mayNotContained,
      actualRepeats,
      expectedRepeats,
    })
    assert.strictEqual(resultActual, result)
  })

  it('simple', async function () {
    assert.throws(() => matchArraySetSimple([], [], isMatcher, match, {mayNotContains: true, mayNotContained: true}),
      /At least one of the options 'mayNotContains' or 'mayNotContained' should be false/)
    assert.throws(() => matchArraySetOptimized([], [], isMatcher, match, {mayNotContains: true, mayNotContained: true}),
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
      matchFunc      : [matchArraySetSimple, matchArraySetOptimized],
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

  it('shouldUseOptimized', function () {
    const options = {}
    function array(values, matchers) {
      return Array.from({length: values + matchers}, (_, i) => i >= values ? {value: i} : i)
    }
    assert.strictEqual(shouldUseOptimized([], [], isMatcher, options), false)
    assert.strictEqual(shouldUseOptimized(array(5, 0), array(6, 0), isMatcher, options), false)
    assert.strictEqual(shouldUseOptimized(array(1, 0), array(30, 0), isMatcher, options), false)
    assert.strictEqual(shouldUseOptimized(array(1, 0), array(31, 0), isMatcher, options), true)
    assert.strictEqual(shouldUseOptimized(array(0, 100), array(0, 100), isMatcher, options), false)
    assert.strictEqual(shouldUseOptimized(array(0, 10000), array(0, 1), isMatcher, options), false)
    assert.strictEqual(shouldUseOptimized(array(0, 9999), array(0, 1), isMatcher, options), false)
    assert.strictEqual(shouldUseOptimized(array(1, 0), array(30, 30), isMatcher, options), true)
    assert.strictEqual(shouldUseOptimized(array(1, 0), array(30, 31), isMatcher, options), false)
  })
})
