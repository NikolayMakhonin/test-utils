import type { MatchResult3, PromiseLikeOrValue } from './contracts';
export declare abstract class Matcher<T = any, Async extends boolean = boolean> {
    abstract get async(): Async;
    abstract match(actual: T): Async extends false ? MatchResult3 : PromiseLikeOrValue<MatchResult3>;
    abstract toString(): string;
}
