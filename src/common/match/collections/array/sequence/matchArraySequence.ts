import {MatchArraySequenceOptions} from './contracts'

export function matchArraySequence(
  actual: number[],
  expected: number[],
  isMatcher: (value: any) => boolean,
  match: (actual: number, expected: number) => boolean,
  options: MatchArraySequenceOptions,
): boolean {
  if (
    (options?.actualMayNotStartWith || options?.actualMayNotEndWith)
    && (options?.expectedMayNotStartWith || options?.expectedMayNotEndWith)
  ) {
    throw new Error(`You can't use both actualMayNotStartWith(${
      options?.actualMayNotStartWith
    })/actualMayNotEndWith(${
      options?.actualMayNotEndWith
    }) and expectedMayNotStartWith(${
      options?.expectedMayNotStartWith
    })/expectedMayNotEndWith(${
      options?.expectedMayNotEndWith
    })`)
  }

  let indexActualStart = 0
  let indexExpectedStart = 0
  let indexActual = 0
  let indexExpected = 0
  let lastIncrementActual = false
  let lastIncrementExpected = false
  let hasAtLeastOneMatch = false
  while (true) {
    if (indexActual >= actual.length || indexExpected >= expected.length) {
      if (indexExpected >= expected.length && options?.actualMayNotEndWith) {
        return true
      }
      if (indexActual >= actual.length && options?.expectedMayNotEndWith) {
        return true
      }
      if (lastIncrementActual && !lastIncrementExpected) {
        indexExpected++
        lastIncrementExpected = true
        continue
      }
      if (hasAtLeastOneMatch && indexActual < actual.length && !options?.actualMayNotEndWith && options?.breaks) {
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

    if (match(actual[indexActual], expected[indexExpected])) {
      hasAtLeastOneMatch = true
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
