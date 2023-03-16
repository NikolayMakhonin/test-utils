/* eslint-disable array-element-newline */
import {createTestVariants} from '@flemist/test-variants'
import {matchArrayMapOptimized} from './matchArrayMapOptimized'
import {match, getKey, getValue} from '../../../test/helpers'

function _getKey(value: any) {
  if (Array.isArray(value)) {
    value = value[0]
  }
  return getKey(value)
}

function _match(actual: any, expected: any) {
  const actualKey = Array.isArray(actual) ? actual[0] : actual
  const actualValue = Array.isArray(actual) ? actual[1] : actual
  const expectedKey = Array.isArray(expected) ? expected[0] : expected
  const expectedValue = Array.isArray(expected) ? expected[1] : expected
  return match(actualKey, expectedKey) && match(actualValue, expectedValue)
}

describe('matchArrayMap', function () {
  this.timeout(30000)

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
    matchFunc: typeof matchArrayMapOptimized
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
    const resultActual = matchArrayMapOptimized(actual, expected, _getKey, _match, {
      mayNotContains,
      mayNotContained,
      actualRepeats,
      expectedRepeats,
    })
    assert.strictEqual(resultActual.result, result)
  })

  it('simple', async function () {
    assert.throws(() => matchArrayMapOptimized([], [], getKey, match, {mayNotContains: true, mayNotContained: true}),
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
      actualEntries: any[]
      expectedEntries: any[]
      actualMatchers: any[]
      expectedMatchers: any[]
    }>({
      matchFunc      : [matchArrayMapOptimized],
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
          'expectedValue',
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
      actualEntries: ({mayNotContainedValues: values}) => [
        values,
        values.map((o) => [getValue(o), o]),
      ],
      expectedEntries: ({expectedShuffle: values, resultFalseType, mayNotContained, actualRepeats}) => [
        ...resultFalseType === 'expectedValue' ? [
          ...values.length > 1 && !mayNotContained
            ? [
              values.map<[number, any]>((o, i) => [getValue(o), o === values[0] ? o + '' : o]),
              values.map<[number, any]>((o, i) => [getValue(o), o === values[values.length - 1] ? o + '' : o]),
            ]
            : [],
          ...values.length > 1 && !mayNotContained && !actualRepeats
            ? [
              values.map<[number, any]>((o, i) => [getValue(o), i === 0 ? o + '' : o]),
              values.map<[number, any]>((o, i) => [getValue(o), i === values.length - 1 ? o + '' : o]),
            ]
            : [],
        ] : [
          values,
          values.map<[number, any]>((o) => [getValue(o), o]),
        ],
      ],
      actualMatchers: ({actualEntries: values}) => [
        values,
        values.map((o, i) => Array.isArray(o)
          ? [o[0], i % 2 === 0 ? o[1] : {value: o[1]}]
          : i % 2 === 0 ? o : {value: o}),
        values.map((o, i) => Array.isArray(o)
          ? [o[0], i % 2 !== 0 ? o[1] : {value: o[1]}]
          : i % 2 !== 0 ? o : {value: o}),
        values.map(o => Array.isArray(o)
          ? [o[0], {value: o[1]}]
          : {value: o}),
      ],
      expectedMatchers: ({expectedEntries: values}) => [
        values,
        values.map((o, i) => Array.isArray(o)
          ? [o[0], i % 2 === 0 ? o[1] : {value: o[1]}]
          : i % 2 === 0 ? o : {value: o}),
        values.map((o, i) => Array.isArray(o)
          ? [o[0], i % 2 !== 0 ? o[1] : {value: o[1]}]
          : i % 2 !== 0 ? o : {value: o}),
        values.map(o => Array.isArray(o)
          ? [o[0], {value: o[1]}]
          : {value: o}),
      ],
      actual: ({actualMatchers: values}) => [
        values,
      ],
      expected: ({expectedMatchers: values, resultFalseType}) => [
        values,
      ],
    })()
  })
})
