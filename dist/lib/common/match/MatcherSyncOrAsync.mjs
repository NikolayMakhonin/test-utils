import { Matcher } from './Matcher.mjs';

class MatcherSyncOrAsync extends Matcher {
    constructor(async) {
        super();
        this._async = async || false;
    }
    get async() {
        return this._async;
    }
    match(actual) {
        if (this.async) {
            return this.matchAsync(actual);
        }
        return this.matchSync(actual);
    }
}

export { MatcherSyncOrAsync };
