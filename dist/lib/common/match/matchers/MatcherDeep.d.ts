import { MatchResult3, ToExpectedDeep } from '../contracts';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync';
import { MatcherObjectOptions } from './MatcherObject';
import { MatcherArrayOptions } from './MatcherArray';
export declare type MatcherDeepOptions = {
    object?: MatcherObjectOptions;
    array?: MatcherArrayOptions;
};
export declare class MatcherDeep<T = any, Async extends boolean = boolean> extends MatcherSyncOrAsync<T, Async> {
    private readonly _expected;
    private readonly _options;
    constructor(async: Async, expected: ToExpectedDeep<T, Async>, options?: MatcherDeepOptions);
    matchAsync(actual: T): Promise<MatchResult3>;
    matchSync(actual: T): MatchResult3;
    toString(): string;
}
