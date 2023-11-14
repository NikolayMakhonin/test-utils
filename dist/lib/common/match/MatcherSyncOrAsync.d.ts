import { Matcher } from './Matcher';
import { MatchResult3, PromiseLikeOrValue } from './contracts';
export declare abstract class MatcherSyncOrAsync<T = any, Async extends boolean = boolean> extends Matcher<T, Async> {
    protected constructor(async: Async);
    private readonly _async;
    get async(): Async;
    abstract matchSync(actual: T): MatchResult3;
    abstract matchAsync(actual: T): PromiseLikeOrValue<MatchResult3>;
    match(actual: T): any;
}
