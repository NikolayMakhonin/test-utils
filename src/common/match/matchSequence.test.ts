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
      if (indexActual < actual.length && !options?.startsWith) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
        continue
      }
      // if (indexActual >= actual.length && indexExpected < expected.length && options?.repeats) {
      //   indexExpectedStart++
      //   indexActual = indexActualStart
      //   indexExpected = indexExpectedStart
      //   lastIncrementActual = false
      //   lastIncrementExpected = false
      //   continue
      // }
      if (indexExpected < expected.length) {
        return false
      }
      if (indexActual < actual.length && options?.endsWith) {
        return false
      }
      return true
    }

    if (actual[indexActual] === expected[indexExpected]) {
      if (options?.repeats) {
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
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
        // lastIncrementActual = false
      }
      else if (!lastIncrementActual && lastIncrementExpected) {
        indexActual++
        lastIncrementActual = true
        // lastIncrementExpected = false
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

  it('equals', async function () {
    await testVariants({
      result    : [true, false],
      startsWith: [true, false],
      endsWith  : [true, false],
      repeats   : [false, true],
      breaks    : [false],
      expected  : ({repeats}) => [
        [],
        [1],
        ...!repeats ? [[1, 1]] : [],
        [1, 2, 3],
      ],
      actual: ({result, expected, startsWith, endsWith, repeats}) => [
        ...result ? [[...expected]] : [],
        ...expected.length === 0 ? [
          ...(!startsWith || !endsWith) === result ? [[1]] : [],
        ]: [
          ...!result ? [[]] : [],
          ...!result ? [[...expected.slice(0, expected.length - 1)]] : [],
          ...!result ? [[...expected.slice(1)]] : [],
          ...!startsWith === result ? [[0, ...expected]] : [],
          ...!endsWith === result ? [[...expected, 0]] : [],
          ...(!startsWith || !endsWith) === result ? [
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
})
