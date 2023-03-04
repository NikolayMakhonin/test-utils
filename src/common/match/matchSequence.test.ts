import {createTestVariants} from '@flemist/test-variants'

type Options = {
  canBeStartBefore?: boolean
  canBeStartAfter?: boolean
  canBeDoneBefore?: boolean
  canBeDoneAfter?: boolean
  actualRepeats?: boolean
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
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
      }
      else if (!lastIncrementActual && lastIncrementExpected) {
        throw new Error('not implemented')
      }
      if (indexActual < actual.length && options?.canBeStartBefore) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
        continue
      }
      if (indexExpected < expected.length && options?.canBeStartAfter) {
        indexExpectedStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
        continue
      }
      if (!options?.canBeDoneBefore && indexExpected < expected.length) {
        return false
      }
      if (!options?.canBeDoneAfter && indexActual < actual.length) {
        return false
      }
      return true
    }

    if (actual[indexActual] === expected[indexExpected]) {
      if (options?.actualRepeats) {
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
      }
      else if (!lastIncrementActual && lastIncrementExpected) {
        throw new Error('not implemented')
      }
      else if (options?.canBeStartBefore) {
        indexActualStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
      }
      else if (options?.canBeStartAfter) {
        indexExpectedStart++
        indexActual = indexActualStart
        indexExpected = indexExpectedStart
        lastIncrementActual = false
        lastIncrementExpected = false
      }
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
    canBeStartBefore,
    canBeStartAfter,
    canBeDoneBefore,
    canBeDoneAfter,
    actualRepeats,
    result,
  }: {
    actual: number[]
    expected: number[]
    canBeStartBefore: boolean
    canBeStartAfter: boolean
    canBeDoneBefore: boolean
    canBeDoneAfter: boolean
    actualRepeats: boolean
    result: boolean
  }) => {
    const resultActual = matchSequence(actual, expected, {
      canBeStartBefore,
      canBeStartAfter,
      canBeDoneBefore,
      canBeDoneAfter,
      actualRepeats,
    })
    assert.strictEqual(resultActual, result)
  })

  it('actualRepeats', async function () {
    await testVariants({
      result  : [true, false],
      expected: ({result}) => result
        ? [[1, 2, 3]]
        : [
          [2, 2, 3],
          [1, 1, 2, 3],
          [1, 2, 2, 3],
          [1, 2, 3, 3],
          [1, 2, 3, 4],
          [1, 2],
        ],
      actual: [
        [1, 2, 3],
        [1, 1, 2, 3],
        [1, 2, 2, 3],
        [1, 2, 3, 3],
        [1, 1, 1, 2, 2, 2, 3, 3, 3],
      ],
      canBeStartBefore: [false],
      canBeStartAfter : [false],
      canBeDoneBefore : [false],
      canBeDoneAfter  : [false],
      actualRepeats   : [true],
    })()
  })

  it('canBeStartBefore', async function () {
    await testVariants<{
      values: number[]
    }>({
      result          : [true, false],
      canBeStartBefore: [true],
      canBeStartAfter : [false],
      canBeDoneBefore : [false],
      canBeDoneAfter  : [false],
      actualRepeats   : [false],
      values          : ({result}) => result
        ? [
          [],
          [1],
          [1, 1],
          [1, 2, 3],
        ]
        : [[1, 2, 3]],
      expected: ({result, values}) => result
        ? [[], [...values]]
        : !values.length ? [[1]] : [
          [values[0], ...values],
          [...values.slice(0, values.length - 1)],
          [...values, 4],
        ],
      actual: ({values}) => [
        [...values],
        [0, ...values],
        [0, 0, ...values],
        [...values, ...values],
        [...values.slice(0, values.length - 1), ...values, ...values],
      ],
    })()
  })

  it('canBeStartAfter', async function () {
    await testVariants<{
      values: number[]
    }>({
      result          : [true, false],
      canBeStartBefore: [false],
      canBeStartAfter : [true],
      canBeDoneBefore : [false],
      canBeDoneAfter  : [false],
      actualRepeats   : [false],
      values          : ({result}) => result
        ? [
          [],
          [1],
          [1, 1],
          [1, 2, 3],
        ]
        : [[1, 2, 3]],
      actual: ({result, values}) => result
        ? [[], [...values]]
        : !values.length ? [[1]] : [
          [values[0], ...values],
          [...values.slice(0, values.length - 1)],
          [...values, 4],
        ],
      expected: ({values}) => [
        [...values],
        [0, ...values],
        [0, 0, ...values],
        [...values, ...values],
        [...values.slice(0, values.length - 1), ...values, ...values],
      ],
    })()
  })
})
