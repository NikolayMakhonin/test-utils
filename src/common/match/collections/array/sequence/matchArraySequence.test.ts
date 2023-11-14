import {createTestVariants} from '@flemist/test-variants'
import {matchArraySequence} from './matchArraySequence'
import {addBreaks, addRepeats, isMatcher, match} from '../../../test/helpers'

describe('matchArraySequence', function () {
  const testVariants = createTestVariants(({
    actual,
    expected,
    actualMayNotStartWith,
    actualMayNotEndWith,
    expectedMayNotStartWith,
    expectedMayNotEndWith,
    repeats,
    breaks,
    result,
  }: {
    actual: number[]
    expected: number[]
    actualMayNotStartWith?: boolean
    actualMayNotEndWith?: boolean
    expectedMayNotStartWith?: boolean
    expectedMayNotEndWith?: boolean
    repeats?: boolean
    breaks?: boolean
    result: boolean
  }) => {
    // console.log(actual)
    // console.log(expected, result)
    // console.log()
    const resultActual = matchArraySequence(actual, expected, isMatcher, match, {
      actualMayNotStartWith,
      actualMayNotEndWith,
      expectedMayNotStartWith,
      expectedMayNotEndWith,
      repeats,
      breaks,
    })

    assert.strictEqual(resultActual.result, result)
    assert.strictEqual(resultActual.cause, void 0)
    if (result) {
      assert.ok(resultActual.nested.length > 0)
      resultActual.nested.forEach((nested, i) => {
        assert.strictEqual(typeof nested.actualKey === 'number', true)
        assert.strictEqual(typeof nested.expectedKey === 'number', true)
        assert.strictEqual(nested.result.result, true)
        assert.strictEqual(nested.result.cause, null)
        assert.strictEqual(nested.result.nested, null)
      })
    }
    else {
      assert.strictEqual(resultActual.nested.length, 1)
      const nested = resultActual.nested[0]
      assert.strictEqual(typeof nested.actualKey === 'number', true)
      assert.strictEqual(typeof nested.expectedKey === 'number', true)
      assert.strictEqual(nested.result.result, false)
      assert.strictEqual(nested.result.cause, null)
      assert.strictEqual(nested.result.nested, null)
    }
  })

  it('variants', async function () {
    await testVariants<{
      resultFalseType: string
      values: number[]
      actualValues: number[]
      repeatsValues: number[]
      breaksValues: number[]
      actualMayNotStartWithValues: number[]
      actualMayNotEndWithValues: number[]
      expectedMayNotStartWithValues: number[]
      expectedMayNotEndWithValues: number[]
    }>({
      result                 : [true, false],
      actualMayNotStartWith  : [false, true],
      actualMayNotEndWith    : [false, true],
      expectedMayNotStartWith: ({actualMayNotStartWith, actualMayNotEndWith}) =>
        actualMayNotStartWith || actualMayNotEndWith ? [false] : [false, true],
      expectedMayNotEndWith: ({actualMayNotStartWith, actualMayNotEndWith, expectedMayNotStartWith}) =>
        actualMayNotStartWith || actualMayNotEndWith ? [false] : [false, true],
      repeats        : [false, true],
      breaks         : [false, true],
      resultFalseType: ({
        result,
        actualMayNotStartWith, actualMayNotEndWith,
        expectedMayNotStartWith, expectedMayNotEndWith,
        repeats, breaks,
      }) => result
        ? ['']
        : [
          'actual',
          ...!actualMayNotStartWith ? ['actualMayNotStartWith'] : [],
          ...!actualMayNotEndWith ? ['actualMayNotEndWith'] : [],
          ...!expectedMayNotStartWith ? ['expectedMayNotStartWith'] : [],
          ...!expectedMayNotEndWith ? ['expectedMayNotEndWith'] : [],
          ...!repeats && !breaks ? ['repeats'] : [],
          ...!breaks ? ['breaks'] : [],
        ],
      values      : [[], [1], [1, 2], [1, 2, 1], [1, 2, 1, 2], [1, 2, 3]],
      actualValues: ({result, resultFalseType, values, expectedMayNotStartWith, expectedMayNotEndWith}) => values.length === 0 ? [] : [
        ...!result && resultFalseType === 'actual'
          ? [
            ...!expectedMayNotStartWith && (values.length > 1 || !expectedMayNotEndWith) ? [values.slice(1)] : [],
            ...!expectedMayNotEndWith && (values.length > 1 || !expectedMayNotStartWith) ? [values.slice(0, values.length - 1)] : [],
          ]
          : [values],
      ],
      breaksValues: ({result, resultFalseType, actualValues: values, breaks}) => [
        ...result || resultFalseType !== 'breaks'
          ? [values]
          : [],
        ...resultFalseType === 'breaks' || result && breaks && values.length > 1
          ? Array.from({length: values.length - 1}, (_, i) => addBreaks(values, i + 1, 1))
          : [],
      ],
      repeatsValues: ({
        result, resultFalseType, actualMayNotStartWith, actualMayNotEndWith, breaksValues: values, repeats,
      }) => [
        ...result || resultFalseType !== 'repeats'
          ? [values]
          : [],
        ...resultFalseType === 'repeats' || result && repeats && values.length > 0
          ? values.map((_, i) => actualMayNotStartWith && i === 0 ? null
            : actualMayNotEndWith && i === values.length - 1 ? null
              : addRepeats(values, i, 1)).filter(o => o)
          : [],
      ],
      actualMayNotStartWithValues: ({result, resultFalseType, repeatsValues: values, actualMayNotStartWith}) => [
        ...result || resultFalseType !== 'actualMayNotStartWith'
          ? [values]
          : [],
        ...resultFalseType === 'actualMayNotStartWith' || result && actualMayNotStartWith
          ? [[0, ...values]]
          : [],
      ],
      actualMayNotEndWithValues: ({result, resultFalseType, actualMayNotStartWithValues: values, actualMayNotEndWith}) => [
        ...result || resultFalseType !== 'actualMayNotEndWith'
          ? [values]
          : [],
        ...resultFalseType === 'actualMayNotEndWith' || result && actualMayNotEndWith
          ? [[...values, 0]]
          : [],
      ],
      expectedMayNotStartWithValues: ({result, resultFalseType, values, expectedMayNotStartWith}) => [
        ...result || resultFalseType !== 'expectedMayNotStartWith'
          ? [values]
          : [],
        ...resultFalseType === 'expectedMayNotStartWith' || result && expectedMayNotStartWith
          ? [[0, ...values]]
          : [],
      ],
      expectedMayNotEndWithValues: ({result, resultFalseType, expectedMayNotStartWithValues: values, expectedMayNotEndWith}) => [
        ...result || resultFalseType !== 'expectedMayNotEndWith'
          ? [values]
          : [],
        ...resultFalseType === 'expectedMayNotEndWith' || result && expectedMayNotEndWith
          ? [[...values, 0]]
          : [],
      ],
      expected: ({expectedMayNotEndWithValues: values}) => [values],
      actual  : ({actualMayNotEndWithValues: values}) => [values],
    })()
  })

  it('variants old', async function () {
    await testVariants<{
      actualValues: number[]
    }>({
      result                 : [true, false],
      actualMayNotStartWith  : [false, true],
      actualMayNotEndWith    : [false, true],
      expectedMayNotStartWith: [false],
      expectedMayNotEndWith  : [false],
      repeats                : [false, true],
      breaks                 : [false, true],
      expected               : ({repeats, result}) => [
        [],
        [1],
        ...!repeats === result ? [[1, 1], [1, 1, 2, 2], [1, 1, 2, 3]] : [],
        [1, 2, 3],
        [1, 2, 1],
        [1, 2, 1, 2],
      ],
      actualValues: ({result, expected, breaks, actualMayNotStartWith, actualMayNotEndWith}) => [
        expected,
        ...expected.length > 1 && breaks ? [
          expected.flatMap((o, i) => i === 0 ? [o] : [0, 0, o]),
          expected.flatMap((o, i) => i === 0 ? [o] : [o, o]),
          expected.flatMap((o, i) => i === 0 ? [o] : [o, 0, o]),
          [...expected, ...expected.slice().reverse(), expected[expected.length - 1]],
          ...actualMayNotStartWith === result ? [[...expected.slice().reverse(), ...expected]] : [],
          ...actualMayNotEndWith === result ? [[...expected, ...expected.slice().reverse()]] : [],
        ] : [],
      ],
      actual: ({
        result, actualValues: expected, actualMayNotStartWith, actualMayNotEndWith, repeats, breaks,
      }) => [
        ...result ? [[...expected]] : [],
        ...expected.length === 0 ? [
          ...(actualMayNotStartWith || actualMayNotEndWith) === result ? [[1]] : [],
        ]: [
          ...!result ? [[]] : [],
          ...!breaks ? [
            ...!result ? [[...expected.slice(0, expected.length - 1)]] : [],
            ...!result ? [[...expected.slice(1)]] : [],
          ] : [],
          ...actualMayNotStartWith === result ? [[0, ...expected]] : [],
          ...actualMayNotEndWith === result ? [[...expected, 0]] : [],
          ...(actualMayNotStartWith || actualMayNotEndWith || breaks) === result ? [
            ...!repeats ? [[...expected, ...expected]] : [],
            [...expected, 0, ...expected],
          ] : [],
          ...(actualMayNotStartWith && actualMayNotEndWith) === result ? [
            [0, ...expected, 0],
            [0, ...expected, 0, ...expected, 0],
          ] : [],
        ],
      ],
    })()
  })

  it('simple', async function () {
    assert.strictEqual(true, matchArraySequence([1, 2, 3], [1, 2, 3, 4], isMatcher, match, {expectedMayNotStartWith: false, expectedMayNotEndWith: true}).result)
    assert.strictEqual(true, matchArraySequence([1, 2, 3], [0, 1, 2, 3], isMatcher, match, {expectedMayNotStartWith: true, expectedMayNotEndWith: false}).result)
    // assert.strictEqual(true, matchSequence([1, 2, 3], [0, 1, 2, 3], isMatcher, match, {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }).result)
    // assert.strictEqual(true, matchSequence([1, 2, 3, 4], [0, 1, 2, 3], isMatcher, match, {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }).result)

    assert.strictEqual(false, matchArraySequence([-1, 1, 2, 3], [1, 2, 3, 4], isMatcher, match, {expectedMayNotStartWith: false, expectedMayNotEndWith: true}).result)
    assert.strictEqual(false, matchArraySequence([-1, 1, 2, 3], [0, 1, 2, 3], isMatcher, match, {expectedMayNotStartWith: true, expectedMayNotEndWith: false}).result)
    // assert.strictEqual(false, matchSequence([1, 2, 3, 4], [0, 1, 2, 3], isMatcher, match, {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }).result)
    // assert.strictEqual(false, matchSequence([1, 2, 3, 4], [0, 1, 2, 3], isMatcher, match, {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }).result)
    assert.throws(() => matchArraySequence([1, 2, 3], [1, 2, 3], isMatcher, match, {
      expectedMayNotStartWith: true,
      expectedMayNotEndWith  : false,
      actualMayNotStartWith  : true,
    }), /You can't use both/i)

    assert.strictEqual(true, matchArraySequence([1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 3], [1, 1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 3, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 3], [1, 2, 3, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}).result)

    assert.strictEqual(true, matchArraySequence([1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}).result)
    assert.strictEqual(true, matchArraySequence([1, 1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 3], [1, 1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}).result)
    assert.strictEqual(true, matchArraySequence([1, 2, 3, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 3], [1, 2, 3, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 1, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}).result)

    assert.strictEqual(true, matchArraySequence([1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)
    assert.strictEqual(true, matchArraySequence([1, 1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)
    assert.strictEqual(false, matchArraySequence([1, 2, 3], [1, 1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)
    assert.strictEqual(true, matchArraySequence([1, 0, 2, 0, 0, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)
    assert.strictEqual(true, matchArraySequence([1, 0, 2, 3, 2, 1, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)
    assert.strictEqual(false, matchArraySequence([1, 0, 2, 3, 2, 1, 3, 2], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)

    assert.strictEqual(true, matchArraySequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: false}).result)
    assert.strictEqual(false, matchArraySequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: false}).result)
    assert.strictEqual(true, matchArraySequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: false, breaks: true}).result)
    assert.strictEqual(true, matchArraySequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: false, breaks: true}).result)
    assert.strictEqual(true, matchArraySequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: true}).result)
    assert.strictEqual(true, matchArraySequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: true}).result)

    assert.strictEqual(false, matchArraySequence([0, 1, 2, 3], [1, 2, 3], isMatcher, match, {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}).result)

  })
})
