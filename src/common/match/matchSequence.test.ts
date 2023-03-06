import {createTestVariants} from '@flemist/test-variants'

type Options = {
  mayNotStartWith?: boolean
  mayNotEndWith?: boolean
  repeats?: boolean
  breaks?: boolean
}

function matchSequence(actual: number[], expected: number[], options: Options): boolean {
  let indexActualStart = 0
  let indexExpectedStart = 0
  let indexActual = 0
  let indexExpected = 0
  let lastIncrementActual = false
  let lastIncrementExpected = false
  while (true) {
    if (indexActual >= actual.length || indexExpected >= expected.length) {
      if (indexExpected >= expected.length && options?.mayNotEndWith) {
        return true
      }
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
        continue
      }
      if (indexActual < actual.length && !options?.mayNotEndWith && options?.breaks) {
        indexActual = actual.length - 1
        indexExpected = expected.length - 1
        lastIncrementActual = true
        lastIncrementExpected = true
        continue
      }
      if (indexActual < actual.length && options?.mayNotStartWith) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
        continue
      }
      if (indexExpected < expected.length) {
        return false
      }
      if (indexActual < actual.length) {
        return false
      }
      return true
    }

    if (actual[indexActual] === expected[indexExpected]) {
      if (options?.repeats && !options?.breaks) {
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
      else if (options?.mayNotStartWith) {
        indexActualStart++
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
    mayNotStartWith,
    mayNotEndWith,
    repeats,
    breaks,
    result,
  }: {
    actual: number[]
    expected: number[]
    mayNotStartWith?: boolean
    mayNotEndWith?: boolean
    repeats?: boolean
    breaks?: boolean
    result: boolean
  }) => {
    const resultActual = matchSequence(actual, expected, {
      mayNotStartWith,
      mayNotEndWith,
      repeats,
      breaks,
    })
    assert.strictEqual(resultActual, result)
  })

  it('variants', async function () {
    await testVariants<{
      actualValues: number[]
    }>({
      result         : [true, false],
      mayNotStartWith: [false, true],
      mayNotEndWith  : [false, true],
      repeats        : [false, true],
      breaks         : [false, true],
      expected       : ({repeats, result}) => [
        [],
        [1],
        ...!repeats === result ? [[1, 1], [1, 1, 2, 2], [1, 1, 2, 3]] : [],
        [1, 2, 3],
        [1, 2, 1],
        [1, 2, 1, 2],
      ],
      actualValues: ({result, expected, breaks, mayNotStartWith, mayNotEndWith}) => [
        expected,
        ...expected.length > 1 && breaks ? [
          expected.flatMap((o, i) => i === 0 ? [o] : [0, 0, o]),
          expected.flatMap((o, i) => i === 0 ? [o] : [o, o]),
          expected.flatMap((o, i) => i === 0 ? [o] : [o, 0, o]),
          [...expected, ...expected.slice().reverse(), expected[expected.length - 1]],
          ...mayNotStartWith === result ? [[...expected.slice().reverse(), ...expected]] : [],
          ...mayNotEndWith === result ? [[...expected, ...expected.slice().reverse()]] : [],
        ] : [],
      ],
      actual: ({
        result, actualValues: expected, mayNotStartWith, mayNotEndWith, repeats, breaks,
      }) => [
        ...result ? [[...expected]] : [],
        ...expected.length === 0 ? [
          ...(mayNotStartWith || mayNotEndWith) === result ? [[1]] : [],
        ]: [
          ...!result ? [[]] : [],
          ...!breaks ? [
            ...!result ? [[...expected.slice(0, expected.length - 1)]] : [],
            ...!result ? [[...expected.slice(1)]] : [],
          ] : [],
          ...mayNotStartWith === result ? [[0, ...expected]] : [],
          ...mayNotEndWith === result ? [[...expected, 0]] : [],
          ...(mayNotStartWith || mayNotEndWith || breaks) === result ? [
            ...!repeats ? [[...expected, ...expected]] : [],
            [...expected, 0, ...expected],
          ] : [],
          ...(mayNotStartWith && mayNotEndWith) === result ? [
            [0, ...expected, 0],
            [0, ...expected, 0, ...expected, 0],
          ] : [],
        ],
      ],
    })()
  })

  it('simple', async function () {
    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 2, 3, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: false}))

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([1, 1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([1, 2, 3, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 2, 3, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 1, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: true, breaks: false}))

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 0, 2, 0, 0, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 0, 2, 3, 2, 1, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))
    assert.strictEqual(false, matchSequence([1, 0, 2, 3, 2, 1, 3, 2], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))

    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {mayNotStartWith: true, mayNotEndWith: true, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {mayNotStartWith: true, mayNotEndWith: true, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {mayNotStartWith: true, mayNotEndWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {mayNotStartWith: true, mayNotEndWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {mayNotStartWith: true, mayNotEndWith: true, repeats: true, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {mayNotStartWith: true, mayNotEndWith: true, repeats: true, breaks: true}))

    assert.strictEqual(false, matchSequence([0, 1, 2, 3], [1, 2, 3], {mayNotStartWith: false, mayNotEndWith: false, repeats: false, breaks: true}))
  })

  it('variants 2', async function () {
    await testVariants<{
      resultFalseType: string
      expectedValues: number[]
      repeatsValues: number[]
      breaksValues: number[]
      mayNotStartWithValues: number[]
      mayNotEndWithValues: number[]
      log: boolean
    }>({
      result         : [true, false],
      mayNotStartWith: [false, true],
      mayNotEndWith  : [true, false],
      repeats        : [false, true],
      breaks         : [false, true],
      resultFalseType: ({result, mayNotStartWith, mayNotEndWith, repeats, breaks}) => result
        ? ['']
        : [
          'expected',
          ...!mayNotStartWith ? ['mayNotStartWith'] : [],
          ...!mayNotEndWith ? ['mayNotEndWith'] : [],
          ...!repeats && !breaks ? ['repeats'] : [],
          ...!breaks ? ['breaks'] : [],
        ],
      expected      : [[], [1], [1, 2], [1, 2, 1], [1, 2, 1, 2], [1, 2, 3]],
      expectedValues: ({result, resultFalseType, expected}) => expected.length === 0 ? [] : [
        ...!result && resultFalseType === 'expected'
          ? [
            expected.slice(0, expected.length - 1),
            expected.slice(1),
          ]
          : [expected],
      ],
      repeatsValues: ({
        result, resultFalseType, mayNotStartWith, mayNotEndWith, expectedValues: expected, repeats,
      }) => [
        ...result || resultFalseType !== 'repeats'
          ? [expected]
          : [],
        ...resultFalseType === 'repeats' || result && repeats && expected.length > 0
          ? expected.map((_, i) => mayNotStartWith && i === 0 ? null
            : mayNotEndWith && i === expected.length - 1 ? null
              : addRepeats(expected, i, 1)).filter(o => o)
          : [],
      ],
      breaksValues: ({result, resultFalseType, repeatsValues: expected, breaks}) => [
        ...result || resultFalseType !== 'breaks'
          ? [expected]
          : [],
        ...resultFalseType === 'breaks' || result && breaks && expected.length > 1
          ? Array.from({length: expected.length - 1}, (_, i) => addBreaks(expected, i + 1, 1))
          : [],
      ],
      mayNotStartWithValues: ({result, resultFalseType, breaksValues: expected, mayNotStartWith}) => [
        ...result || resultFalseType !== 'mayNotStartWith'
          ? [expected]
          : [],
        ...resultFalseType === 'mayNotStartWith' || result && mayNotStartWith
          ? [[0, ...expected]]
          : [],
      ],
      mayNotEndWithValues: ({result, resultFalseType, mayNotStartWithValues: expected, mayNotEndWith}) => [
        ...result || resultFalseType !== 'mayNotEndWith'
          ? [expected]
          : [],
        ...resultFalseType === 'mayNotEndWith' || result && mayNotEndWith
          ? [[...expected, 0]]
          : [],
      ],
      actual: ({
        result, mayNotEndWithValues: expected, mayNotStartWith, mayNotEndWith, repeats, breaks,
      }) => [
        [...expected],
      ],
      log: ({actual, result}) => {
        console.log(actual, result)
        return [true]
      },
    })()
  })
})
