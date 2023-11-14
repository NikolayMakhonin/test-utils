import { matchAsync, matchSync } from './match.mjs';
import 'tslib';
import './Matcher.mjs';
import '@flemist/async-utils';
import './MatchInternalError.mjs';
import './helpers.mjs';

function match(actual) {
    function _matchSync(expected) {
        return matchSync(actual, expected);
    }
    _matchSync.async = function _matchAsync(expected) {
        return matchAsync(actual, expected);
    };
    return _matchSync;
}
// match(1)(1)

export { match };
