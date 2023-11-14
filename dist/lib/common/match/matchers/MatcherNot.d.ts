import { Expected, MatchResult3 } from '../contracts';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync';
export declare class MatcherNot<T = any, Async extends boolean = boolean> extends MatcherSyncOrAsync<T, Async> {
    private readonly _expected;
    constructor(async: Async, expected: Expected<T, Async>);
    matchAsync(actual: T): Promise<MatchResult3>;
    matchSync(actual: T): MatchResult3;
    toString(): string;
}
