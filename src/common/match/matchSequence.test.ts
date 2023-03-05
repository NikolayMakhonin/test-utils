import {createTestVariants} from '@flemist/test-variants'

type Options = {
  startsWith?: boolean
  endsWith?: boolean
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
      if (indexExpected >= expected.length && !options?.endsWith) {
        return true
      }
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
        // lastIncrementActual = false
        continue
      }
      // else if (!lastIncrementActual && lastIncrementExpected) {
      //   throw new Error('not implemented')
      // }
      if (indexActual < actual.length && options?.endsWith && options?.breaks) {
        indexActual = actual.length - 1
        indexExpected = expected.length - 1
        lastIncrementActual = true
        lastIncrementExpected = true
        continue
      }
      if (indexActual < actual.length && !options?.startsWith) {
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
      if (indexActual < actual.length && options?.endsWith) {
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
        lastIncrementActual = true
        lastIncrementExpected = true
      }
    }
    else {
      if (options?.breaks && indexActual > 0 && indexActual < actual.length - 1) {
        indexActual++
        lastIncrementActual = true
        lastIncrementExpected = true
        continue
      }
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
      }
      else if (!lastIncrementActual && lastIncrementExpected) {
        indexActual++
        lastIncrementActual = true
      }
      else if (!options?.startsWith) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
      }
      // else if (options?.repeats) {
      //   indexExpectedStart++
      //   indexActual = indexActualStart
      //   indexExpected = indexExpectedStart
      //   lastIncrementActual = false
      //   lastIncrementExpected = false
      // }
      else {
        return false
      }
    }
  }
}

describe('matchSequence', function () {
  const testVariants = createTestVariants(({
    actual,
    expected,
    startsWith,
    endsWith,
    repeats,
    breaks,
    result,
  }: {
    actual: number[]
    expected: number[]
    startsWith?: boolean
    endsWith?: boolean
    repeats?: boolean
    breaks?: boolean
    result: boolean
  }) => {
    const resultActual = matchSequence(actual, expected, {
      startsWith,
      endsWith,
      repeats,
      breaks,
    })
    assert.strictEqual(resultActual, result)
  })

  it('variants', async function () {
    await testVariants<{
      actualValues: number[]
    }>({
      result    : [true, false],
      startsWith: [true, false],
      endsWith  : [true, false],
      repeats   : [false, true],
      breaks    : [false, true],
      expected  : ({repeats}) => [
        [],
        [1],
        ...!repeats ? [[1, 1], [1, 1, 2, 2]] : [],
        [1, 2, 3],
      ],
      actualValues: ({result, expected, breaks, startsWith, endsWith}) => [
        expected,
        ...expected.length > 1 && breaks ? [
          expected.flatMap((o, i) => i === 0 ? [o] : [0, 0, o]),
          expected.flatMap((o, i) => i === 0 ? [o] : [o, o]),
          expected.flatMap((o, i) => i === 0 ? [o] : [o, 0, o]),
          [...expected, ...expected.slice().reverse(), expected[expected.length - 1]],
          ...!startsWith === result ? [[...expected.slice().reverse(), ...expected]] : [],
          ...!endsWith === result ? [[...expected, ...expected.slice().reverse()]] : [],
        ] : [],
      ],
      actual: ({
        result, actualValues: expected, startsWith, endsWith, repeats, breaks,
      }) => [
        ...result ? [[...expected]] : [],
        ...expected.length === 0 ? [
          ...(!startsWith || !endsWith) === result ? [[1]] : [],
        ]: [
          ...!result ? [[]] : [],
          ...!breaks ? [
            ...!result ? [[...expected.slice(0, expected.length - 1)]] : [],
            ...!result ? [[...expected.slice(1)]] : [],
          ] : [],
          ...!startsWith === result ? [[0, ...expected]] : [],
          ...!endsWith === result ? [[...expected, 0]] : [],
          ...(!startsWith || !endsWith || breaks) === result ? [
            ...!repeats ? [[...expected, ...expected]] : [],
            [...expected, 0, ...expected],
          ] : [],
          ...(!startsWith && !endsWith) === result ? [
            [0, ...expected, 0],
            [0, ...expected, 0, ...expected, 0],
          ] : [],
        ],
      ],
    })()
  })

  it('simple', async function () {
    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 1, 2, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 2, 3, 3], {startsWith: true, endsWith: true, repeats: false, breaks: false}))

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([1, 1, 2, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {startsWith: true, endsWith: true, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([1, 2, 3, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 2, 3, 3], {startsWith: true, endsWith: true, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([1, 2, 1, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: true, breaks: false}))

    assert.strictEqual(true, matchSequence([1, 2, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 1, 2, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: true}))
    assert.strictEqual(false, matchSequence([1, 2, 3], [1, 1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 0, 2, 0, 0, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([1, 0, 2, 3, 2, 1, 3], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: true}))
    assert.strictEqual(false, matchSequence([1, 0, 2, 3, 2, 1, 3, 2], [1, 2, 3], {startsWith: true, endsWith: true, repeats: false, breaks: true}))

    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {startsWith: false, endsWith: false, repeats: true, breaks: false}))
    assert.strictEqual(false, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {startsWith: false, endsWith: false, repeats: true, breaks: false}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {startsWith: false, endsWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {startsWith: false, endsWith: false, repeats: false, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 3, 3, 0], [1, 2, 3], {startsWith: false, endsWith: false, repeats: true, breaks: true}))
    assert.strictEqual(true, matchSequence([0, 1, 1, 2, 2, 1, 3, 3, 0], [1, 2, 3], {startsWith: false, endsWith: false, repeats: true, breaks: true}))
  })
})
