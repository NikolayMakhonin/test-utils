import { ExpectedAsync, ExpectedSync, MatchResult, PromiseLikeOrValue } from './contracts';
export declare function match<T>(actual: T): {
    (expected: ExpectedSync<T>): MatchResult<T>;
    async(expected: ExpectedAsync<T>): PromiseLikeOrValue<MatchResult<T>>;
};
