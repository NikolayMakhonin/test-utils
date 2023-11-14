'use strict';

var rdtsc = require('rdtsc');
var common_match_collections_array_set_matchArraySetSimple = require('./matchArraySetSimple.cjs');
var common_match_collections_array_set_matchArraySet = require('./matchArraySet.cjs');
var common_match_test_helpers = require('../../../test/helpers.cjs');
var common_match_collections_array_set_matchArrayMapOptimized = require('./matchArrayMapOptimized.cjs');
require('./matchArraySetOptimized.cjs');
require('../../../contracts.cjs');
require('../../../match.cjs');
require('tslib');
require('../../../Matcher.cjs');
require('@flemist/async-utils');
require('../../../MatchInternalError.cjs');
require('../../../helpers.cjs');

/* eslint-disable array-element-newline */
describe('matchArray', function () {
    it('perf', function () {
        let actual = [
            { value: 1 }, 2, 4,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 3,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 3,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 3,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 3,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 3,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
            { value: 1 }, 2, 3,
            1, { value: 2 }, 3,
            1, 2, { value: 3 },
        ];
        let expected = [
            1, { value: 2 }, 3,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 4,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 4,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 3,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 4,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 4,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 3,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 4,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
            1, { value: 2 }, 4,
            1, 2, { value: 4 },
            { value: 1 }, 2, 4,
        ];
        actual = [
            1, 5, 4,
            1, 5, 3,
            1, 2, 3,
        ];
        expected = [
            1, 2, 3,
            1, 2, 4,
            1, 5, 4,
        ];
        // actual = [...actual, ...actual]
        // expected = [...expected, ...expected]
        const result = rdtsc.calcPerformance(1000, () => {
        }, () => {
            common_match_collections_array_set_matchArraySetSimple.matchArraySetSimple(actual, expected, common_match_test_helpers.isMatcher, common_match_test_helpers.match, {
                mayNotContains: true,
                mayNotContained: false,
                actualRepeats: true,
                expectedRepeats: true,
            });
            common_match_collections_array_set_matchArraySetSimple.matchArraySetSimple(actual, expected, common_match_test_helpers.isMatcher, common_match_test_helpers.match, {
                mayNotContains: false,
                mayNotContained: true,
                actualRepeats: true,
                expectedRepeats: true,
            });
            common_match_collections_array_set_matchArraySetSimple.matchArraySetSimple(actual, expected, common_match_test_helpers.isMatcher, common_match_test_helpers.match, {
                mayNotContains: false,
                mayNotContained: false,
                actualRepeats: true,
                expectedRepeats: true,
            });
        }, () => {
            common_match_collections_array_set_matchArraySet.matchArraySet(actual, expected, common_match_test_helpers.isMatcher, common_match_test_helpers.match, {
                mayNotContains: true,
                mayNotContained: false,
                actualRepeats: true,
                expectedRepeats: true,
            });
            common_match_collections_array_set_matchArraySet.matchArraySet(actual, expected, common_match_test_helpers.isMatcher, common_match_test_helpers.match, {
                mayNotContains: false,
                mayNotContained: true,
                actualRepeats: true,
                expectedRepeats: true,
            });
            common_match_collections_array_set_matchArraySet.matchArraySet(actual, expected, common_match_test_helpers.isMatcher, common_match_test_helpers.match, {
                mayNotContains: false,
                mayNotContained: false,
                actualRepeats: true,
                expectedRepeats: true,
            });
        }, () => {
            common_match_collections_array_set_matchArrayMapOptimized.matchArrayMapOptimized(actual, expected, common_match_test_helpers.getKey, common_match_test_helpers.match, {
                mayNotContains: true,
                mayNotContained: false,
                actualRepeats: true,
                expectedRepeats: true,
            });
            common_match_collections_array_set_matchArrayMapOptimized.matchArrayMapOptimized(actual, expected, common_match_test_helpers.getKey, common_match_test_helpers.match, {
                mayNotContains: false,
                mayNotContained: true,
                actualRepeats: true,
                expectedRepeats: true,
            });
            common_match_collections_array_set_matchArrayMapOptimized.matchArrayMapOptimized(actual, expected, common_match_test_helpers.getKey, common_match_test_helpers.match, {
                mayNotContains: false,
                mayNotContained: false,
                actualRepeats: true,
                expectedRepeats: true,
            });
        });
        console.log('perf iterations: ' + result.calcInfo.iterations);
        console.log(result.relativeDiff.map(o => Math.round((o - 1) * 100) + '%').join('\r\n'));
    });
});
