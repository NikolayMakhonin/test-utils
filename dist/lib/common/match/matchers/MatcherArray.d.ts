import { MatchResult3, ToExpectedArray } from '../contracts';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync';
export declare type MatcherArrayOptions = {
    contains?: boolean;
    contained?: boolean;
};
export declare class MatcherArray<T extends any[] = any[], Async extends boolean = boolean> extends MatcherSyncOrAsync<T, Async> {
    private readonly _expected;
    private readonly _options;
    constructor(async: Async, expected: ToExpectedArray<T, Async>, options?: MatcherArrayOptions);
    matchAsync(actual: T): Promise<MatchResult3>;
    matchSync(actual: T): MatchResult3;
    toString(): string;
}
