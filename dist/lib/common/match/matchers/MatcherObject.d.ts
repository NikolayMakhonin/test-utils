import { MatchResult3, ToExpectedObject } from '../contracts';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync';
export declare type MatcherObjectOptions = {
    containing?: boolean;
    ordered?: boolean;
};
export declare class MatcherObject<T extends object = any, Async extends boolean = boolean> extends MatcherSyncOrAsync<T, Async> {
    private readonly _expected;
    private readonly _options;
    constructor(async: Async, expected: ToExpectedObject<T, Async>, options?: MatcherObjectOptions);
    matchAsync(actual: T): Promise<MatchResult3>;
    matchSync(actual: T): MatchResult3;
    toString(): string;
}
