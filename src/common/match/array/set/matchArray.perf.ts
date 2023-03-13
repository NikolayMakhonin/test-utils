/* eslint-disable array-element-newline */
import {calcPerformance} from 'rdtsc'
import {matchArraySetSimple} from './matchArraySetSimple'
import {matchArraySet, shouldUseOptimized} from './matchArraySet'
import {getKey, isMatcher, match} from '../../test/helpers'
import {matchArrayMapOptimized} from "src/common/match/array/set/matchArrayMapOptimized";

describe('matchArray', function () {
  it('perf', function () {
    let actual = [
      {value: 1}, 2, 4,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 4,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 4,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
      {value: 1}, 2, 3,
      1, {value: 2}, 3,
      1, 2, {value: 3},
    ]
    let expected = [
      1, {value: 2}, 3,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 3,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 3,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
      1, {value: 2}, 4,
      1, 2, {value: 4},
      {value: 1}, 2, 4,
    ]

    actual = [
      1, 5, 4,
      1, 5, 3,
      1, 2, 3,
    ]
    expected = [
      1, 2, 3,
      1, 2, 4,
      1, 5, 4,
    ]
    // actual = [...actual, ...actual]
    // expected = [...expected, ...expected]

    const result = calcPerformance(
      1000,
      () => {

      },
      () => {
        matchArraySetSimple(actual, expected, isMatcher, match, {
          mayNotContains : true,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySetSimple(actual, expected, isMatcher, match, {
          mayNotContains : false,
          mayNotContained: true,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySetSimple(actual, expected, isMatcher, match, {
          mayNotContains : false,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
      },
      () => {
        matchArraySet(actual, expected, isMatcher, match, {
          mayNotContains : true,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySet(actual, expected, isMatcher, match, {
          mayNotContains : false,
          mayNotContained: true,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArraySet(actual, expected, isMatcher, match, {
          mayNotContains : false,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
      },
      () => {
        matchArrayMapOptimized(actual, expected, getKey, match, {
          mayNotContains : true,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArrayMapOptimized(actual, expected, getKey, match, {
          mayNotContains : false,
          mayNotContained: true,
          actualRepeats  : true,
          expectedRepeats: true,
        })
        matchArrayMapOptimized(actual, expected, getKey, match, {
          mayNotContains : false,
          mayNotContained: false,
          actualRepeats  : true,
          expectedRepeats: true,
        })
      },
    )

    console.log('perf iterations: ' + result.calcInfo.iterations)
    console.log(result.relativeDiff.map(o => Math.round((o - 1) * 100) + '%').join('\r\n'))
  })
})
