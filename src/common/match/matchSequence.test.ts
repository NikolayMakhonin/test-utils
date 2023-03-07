import {createTestVariants} from '@flemist/test-variants'

type Options = {
  actualMayNotStartWith?: boolean
  actualMayNotEndWith?: boolean
  expectedMayNotStartWith?: boolean
  expectedMayNotEndWith?: boolean
  repeats?: boolean
  breaks?: boolean
}

function matchSequence(actual: number[], expected: number[], options: Options): boolean {
  if (options?.actualMayNotStartWith && options?.expectedMayNotStartWith) {
    throw new Error('not implemented')
  }

  let indexActualStart = 0
  let indexExpectedStart = 0
  let indexActual = 0
  let indexExpected = 0
  let lastIncrementActual = false
  let lastIncrementExpected = false
  while (true) {
    if (indexActual >= actual.length || indexExpected >= expected.length) {
      if (indexExpected >= expected.length && options?.actualMayNotEndWith) {
        return true
      }
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
        continue
      }
      if (indexActual < actual.length && !options?.actualMayNotEndWith && options?.breaks) {
        indexActual = actual.length - 1
        indexExpected = expected.length - 1
        lastIncrementActual = true
        lastIncrementExpected = true
        continue
      }
      if (indexActual < actual.length && options?.actualMayNotStartWith) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
        continue
      }
      if (indexExpected < expected.length && options?.expectedMayNotStartWith) {
        indexActualStart = 0
        indexExpectedStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
        continue
      }
      if (indexExpected < expected.length && !options?.expectedMayNotEndWith) {
        return false
      }
      if (indexActual < actual.length) {
        return false
      }
      return true
    }

    if (actual[indexActual] === expected[indexExpected]) {
      if (options?.repeats && (!options?.breaks || indexActual >= actual.length - 2)) {
        indexActual++
        lastIncrementActual = true
        lastIncrementExpected = false
      }
      else {
        indexActual++
        indexExpected++
      }
    }
    else {
      if (options?.breaks && indexActual > 0 && indexActual < actual.length - 1) {
        indexActual++
        continue
      }
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
      }
      else if (options?.actualMayNotStartWith) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
      }
      else if (options?.expectedMayNotStartWith && indexExpectedStart < expected.length) {
        indexExpectedStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
      }
      else {
        return false
      }
    }
  }
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

describe('matchSequence', function () {
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
    // console.log(actual, result)
    const resultActual = matchSequence(actual, expected, {
      actualMayNotStartWith,
      actualMayNotEndWith,
      expectedMayNotStartWith,
      expectedMayNotEndWith,
      repeats,
      breaks,
    })
    assert.strictEqual(resultActual, result)
  })

  it('variants', async function () {
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
    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3, 4], {expectedMayNotStartWith: false, expectedMayNotEndWith: true}))
    assert.strictEqual(true, matchSequence([1, 2, 3], [0, 1, 2, 3], {expectedMayNotStartWith: true, expectedMayNotEndWith: false}))
    // assert.strictEqual(true, matchSequence([1, 2, 3], [0, 1, 2, 3], {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }))
    // assert.strictEqual(true, matchSequence([1, 2, 3, 4], [0, 1, 2, 3], {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }))

    assert.strictEqual(false, matchSequence([-1, 1, 2, 3], [1, 2, 3, 4], {expectedMayNotStartWith: false, expectedMayNotEndWith: true}))
    assert.strictEqual(false, matchSequence([-1, 1, 2, 3], [0, 1, 2, 3], {expectedMayNotStartWith: true, expectedMayNotEndWith: false}))
    // assert.strictEqual(false, matchSequence([1, 2, 3, 4], [0, 1, 2, 3], {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }))
    // assert.strictEqual(false, matchSequence([1, 2, 3, 4], [0, 1, 2, 3], {
    //   expectedMayNotStartWith: true,
    //   expectedMayNotEndWith  : false,
    //   actualMayNotStartWith  : true,
    // }))
    assert.throws(() => matchSequence([1, 2, 3], [1, 2, 3], {
      expectedMayNotStartWith: true,
      expectedMayNotEndWith  : false,
      actualMayNotStartWith  : true,
    }), /not implemented/i)

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 2, 3, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: false}))

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([1, 1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([1, 2, 3, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 2, 3, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 1, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: true, breaks: false}))

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 0, 2, 0, 0, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 0, 2, 3, 2, 1, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(false, matchSequence([1, 0, 2, 3, 2, 1, 3, 2], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))

    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {actualMayNotStartWith: true, actualMayNotEndWith: true, repeats: true, breaks: true}))

    assert.strictEqual(false, matchSequence([0, 1, 2, 3], [1, 2, 3], {actualMayNotStartWith: false, actualMayNotEndWith: false, repeats: false, breaks: true}))

  })

  it('variants 2', async function () {
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
      actualMayNotStartWith  : [false],
      actualMayNotEndWith    : [false],
      expectedMayNotStartWith: ({actualMayNotStartWith, actualMayNotEndWith}) =>
        actualMayNotStartWith || actualMayNotEndWith ? [false] : [false, true],
      expectedMayNotEndWith: ({actualMayNotStartWith, actualMayNotEndWith, expectedMayNotStartWith}) =>
        actualMayNotStartWith || actualMayNotEndWith || expectedMayNotStartWith ? [false] : [false, true],
      repeats        : [false],
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
})
