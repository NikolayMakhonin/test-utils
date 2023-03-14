/* eslint-disable array-element-newline */
import {createTestVariants} from '@flemist/test-variants'
import {matchMap} from './matchMap'
import {getValue, match} from '../../test/helpers'

describe('matchMap', function () {
  const testVariants = createTestVariants(({
    matchFunc,
    actual,
    expected,
    result,
    mayNotContains,
    mayNotContained,
  }: {
    matchFunc: typeof matchMap
    actual: Map<any, any>
    expected: Map<any, any>
    result: boolean
    mayNotContains?: boolean
    mayNotContained?: boolean
  }) => {
    // console.log(actual)
    // console.log(expected, result)
    // console.log()
    const resultActual = matchMap(actual, expected, match, {
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
      actualEntries: [number, any][]
      expectedEntries: [number, any][]
      actualMatchers: [number, any][]
      expectedMatchers: [number, any][]
    }>({
      matchFunc      : [matchMap],
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
          'expectedValue',
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
      actualEntries: ({mayNotContainedValues: values}) => [
        values.map((o) => [getValue(o), o]),
      ],
      expectedEntries: ({mayNotContainsValues: values, resultFalseType}) => [
        ...resultFalseType === 'expectedValue' ? [
          values.map<[number, any]>((o, i) => [getValue(o), i === 0 ? o + '' : o]),
          values.map<[number, any]>((o, i) => [getValue(o), i === values.length - 1 ? o + '' : o]),
        ] : [
          values.map<[number, any]>((o) => [getValue(o), o]),
        ],
      ],
      actualMatchers: ({actualEntries: values}) => [
        values,
        values.map((o, i) => [o[0], i % 2 === 0 ? o[1] : {value: o[1]}]),
        values.map((o, i) => [o[0], i % 2 !== 0 ? o[1] : {value: o[1]}]),
        values.map(o => [o[0], {value: o[1]}]),
      ],
      expectedMatchers: ({expectedEntries: values}) => [
        values,
        values.map((o, i) => [o[0], i % 2 === 0 ? o[1] : {value: o[1]}]),
        values.map((o, i) => [o[0], i % 2 !== 0 ? o[1] : {value: o[1]}]),
        values.map(o => [o[0], {value: o[1]}]),
      ],
      actual: ({actualMatchers: values}) => [
        new Map(values),
      ],
      expected: ({expectedMatchers: values, resultFalseType}) => [
        new Map(values),
      ],
    })()
  })
})
