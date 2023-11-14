import type { Matcher } from './Matcher';
export declare type PromiseLikeOrValue<T> = T | PromiseLike<T>;
export declare type MatchResultNested = {
    actualKey: string | number;
    expectedKey?: string | number;
    result: MatchResult<any>;
};
export declare type MatchResult<T> = {
    actual: T;
    expected: Expected<T>;
    result: boolean | null;
    cause: string | null;
    nested: MatchResultNested[] | null;
    error: Error | null;
};
export interface MatchResult2 {
    result: boolean;
    cause?: string;
    nested?: MatchResultNested[];
}
export declare type MatchResult3 = boolean | string | MatchResult2;
export declare type Match<T, Async extends boolean> = Async extends false ? MatchSync<T> : MatchAsync<T>;
export declare type MatchSync<T> = (value: T) => MatchResult3;
export declare type MatchAsync<T> = (value: T) => PromiseLikeOrValue<MatchResult3>;
export declare type MatcherSync<T> = Matcher<T, false>;
export declare type MatcherAsync<T> = Matcher<T, true>;
export declare type Expected<T, Async extends boolean = boolean> = T | Matcher<T, Async>;
export declare type ExpectedSync<T> = Expected<T, false>;
export declare type ExpectedAsync<T> = Expected<T, true>;
export declare type ToExpectedObject<T extends object, Async extends boolean = boolean> = {
    [key in keyof T]: Expected<T[key], Async>;
};
export declare type TIterator<T, Async extends boolean> = Async extends true ? Iterator<T> | AsyncIterator<T> : Iterator<T>;
export declare type TIterable<T, Async extends boolean> = Async extends true ? Iterable<T> | AsyncIterable<T> : Iterable<T>;
export declare type ToExpectedIterator<T extends TIterator<any, Async>, Async extends boolean = boolean> = T extends TIterator<infer C, Async> ? TIterator<Expected<C, Async>, Async> : never;
export declare type ToExpectedIterable<T extends TIterable<any, Async>, Async extends boolean = boolean> = T extends TIterable<infer C, Async> ? TIterable<Expected<C, Async>, Async> : never;
export declare type ToExpectedArray<T extends any[], Async extends boolean = boolean> = T extends [infer A, ...infer B] ? [Expected<A, Async>, ...(B extends never[] ? [] : ToExpectedArray<B, Async>)] : T extends Array<infer C> ? Expected<C, Async>[] : never;
declare type ToExpectedObjectDeep<T extends object, Async extends boolean = boolean> = {
    [key in keyof T]: ToExpectedDeep<T[key], Async>;
};
declare type ToExpectedArrayDeep<T extends any[], Async extends boolean = boolean> = T extends [infer A, ...infer B] ? [ToExpectedDeep<A, Async>, ...(B extends never[] ? [] : ToExpectedArrayDeep<B, Async>)] : T extends Array<infer C> ? ToExpectedDeep<C, Async>[] : never;
export declare type ToExpectedDeep<T, Async extends boolean = boolean> = T extends any[] ? ToExpectedArrayDeep<T, Async> : T extends object ? ToExpectedObjectDeep<T, Async> : Expected<T, Async>;
export declare const ANY: any;
export declare const UNSET: any;
export {};
