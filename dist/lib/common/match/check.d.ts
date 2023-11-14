import { MatchResult, PromiseLikeOrValue } from './contracts';
export declare function checkSync<T>(matchResult: MatchResult<T>): void;
export declare function checkAsync<T>(matchResultAsync: PromiseLikeOrValue<MatchResult<T>>): Promise<void>;
export declare function check<T>(matchResult: MatchResult<T>): void;
export declare function check<T>(matchResult: PromiseLike<MatchResult<T>>): PromiseLikeOrValue<void>;
