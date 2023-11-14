import { MatchResult3, TIterator, ToExpectedIterator } from '../contracts';
import { MatcherSyncOrAsync } from '../MatcherSyncOrAsync';
export declare type MatcherIteratorOptions = {
    canBeDoneBefore?: boolean;
    canBeDoneAfter?: boolean;
    actualDuplicatesRange?: [min: number | null, max: number | null];
    expectedDuplicatesRange?: [min: number | null, max: number | null];
};
export declare class MatcherIterator<T extends TIterator<any, Async>, Async extends boolean = boolean> extends MatcherSyncOrAsync<T, Async> {
    private readonly _expected;
    private readonly _options;
    constructor(async: Async, expected: ToExpectedIterator<T, Async>, options?: MatcherIteratorOptions);
    matchAsync(actual: T): Promise<MatchResult3>;
    matchSync(actual: T): MatchResult3;
    toString(): string;
}
