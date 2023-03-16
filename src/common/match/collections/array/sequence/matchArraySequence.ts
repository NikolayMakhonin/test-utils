import {MatchArraySequenceOptions} from './contracts'
import {MatchResult, MatchResult2, MatchResultNested, UNSET} from 'src/common/match/contracts'

export function matchArraySequence(
  actual: number[],
  expected: number[],
  isMatcher: (value: any) => boolean,
  match: (actual: number, expected: number) => MatchResult<number>,
  options: MatchArraySequenceOptions,
): MatchResult2 {
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

  const nestedTrue: MatchResultNested[] = []
  let nestedFalse: MatchResultNested
  let nestedTrueMaxLength = -1

  while (true) {
    if (indexActual >= actual.length || indexExpected >= expected.length) {
      if (indexExpected >= expected.length && options?.actualMayNotEndWith) {
        return {
          result: true,
          nested: nestedTrue,
        }
      }
      if (indexActual >= actual.length && options?.expectedMayNotEndWith) {
        return {
          result: true,
          nested: nestedTrue,
        }
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
        return {
          result: false,
          nested: [nestedFalse || {
            key   : indexActual,
            result: {
              actual  : actual[indexActual],
              expected: UNSET,
              result  : false,
              cause   : null,
              nested  : null,
              error   : null,
            },
          }],
        }
      }
      if (indexActual < actual.length) {
        return {
          result: false,
          nested: [nestedFalse || {
            key   : indexActual,
            result: {
              actual  : UNSET,
              expected: expected[indexExpected],
              result  : false,
              cause   : null,
              nested  : null,
              error   : null,
            },
          }],
        }
      }
      return {
        result: true,
        nested: nestedTrue,
      }
    }

    const actualItem = actual[indexActual]
    const expectedItem = expected[indexExpected]
    const matchResult = match(actualItem, expectedItem)

    if (matchResult.result) {
      nestedTrue.push({
        key   : indexActual,
        result: matchResult,
      })

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
      if (nestedTrue.length > nestedTrueMaxLength) {
        nestedTrueMaxLength = nestedTrue.length
        nestedFalse = {
          key   : indexActual,
          result: matchResult,
        }
      }

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
        return {
          result: false,
          nested: [nestedFalse],
        }
      }
    }
  }
}
