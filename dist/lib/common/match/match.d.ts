import type { Expected, ExpectedSync, MatchResult, MatchResult3, PromiseLikeOrValue } from './contracts';
export declare function createMatchResultSync<T>(actual: T, expected: Expected<T>, result: MatchResult3): MatchResult<T>;
export declare function matchSync<T>(actual: T, expected: ExpectedSync<T>): MatchResult<T>;
export declare function matchAsync<T>(actual: T, expected: Expected<T>): PromiseLikeOrValue<MatchResult<T>>;
export declare function match<T>(actual: T, expected: Expected<T, false>): MatchResult<T>;
export declare function match<T>(actual: T, expected: Expected<T, true>): PromiseLikeOrValue<MatchResult<T>>;
