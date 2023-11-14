import { AsymmetricMatchers, BaseExpect, MatcherContext, Matchers } from 'expect';
import { CustomMatch } from './matchers/contracts';
declare type AsymmetricMatcher_2 = {
    asymmetricMatch(other: unknown): boolean;
    toString(): string;
    getExpectedType?(): string;
    toAsymmetricMatcher?(): string;
};
declare type CustomMatchAsymmetric = <Context extends MatcherContext = MatcherContext>(this: Context, received: unknown) => boolean;
declare type MatchersExt<R extends void | Promise<void>> = Matchers<R> & {
    custom: (match: CustomMatch) => AsymmetricMatcher_2;
};
declare type AsymmetricMatchersExt = AsymmetricMatchers & {
    custom: (match: CustomMatchAsymmetric | CustomMatch, message?: string | (() => string)) => AsymmetricMatcher_2;
};
declare type Inverse<Matchers> = {
    /**
     * Inverse next match. If you know how to test something, `.not` lets you test its opposite.
     */
    not: Matchers;
};
declare type PromiseMatchersExt = {
    /**
     * Unwraps the reason of a rejected promise so any other match can be chained.
     * If the promise is fulfilled the assertion fails.
     */
    rejects: MatchersExt<Promise<void>> & Inverse<MatchersExt<Promise<void>>>;
    /**
     * Unwraps the value of a fulfilled promise so any other match can be chained.
     * If the promise is rejected the assertion fails.
     */
    resolves: MatchersExt<Promise<void>> & Inverse<MatchersExt<Promise<void>>>;
};
export declare type ExpectExt = (<T = unknown>(actual: T) => MatchersExt<void> & Inverse<MatchersExt<void>> & PromiseMatchersExt) & BaseExpect & AsymmetricMatchersExt & Inverse<Omit<AsymmetricMatchersExt, 'any' | 'anything'>>;
export {};
