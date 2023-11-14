import { Expected, ExpectedAsync, ExpectedSync, MatchResult } from './contracts';
export declare type CheckResult<T, Async extends boolean> = Async extends false ? CheckResultSync<T> : CheckResultAsync<T>;
export declare type CheckResultSync<T> = (expected: ExpectedSync<T>) => CheckResultSync<T>;
export declare type CheckResultAsync<T> = (expected: ExpectedAsync<T>) => CheckResultAsync<T> & PromiseLike<void>;
export declare class Checker<T, Async extends boolean> implements PromiseLike<void> {
    protected readonly actual: T;
    constructor(async: Async, actual: T);
    private readonly _async;
    get async(): Async;
    protected throwError(result: MatchResult<any>): void;
    protected checkSync(expected: ExpectedSync<T>): void;
    protected checkAsync(expected: ExpectedAsync<T>): Promise<void>;
    private readonly _promises;
    check(expected: Expected<T, Async>): this;
    then(resolve: any, reject: any): Promise<any>;
}
export declare function checkSync<T>(actual: T): CheckResultSync<T>;
export declare function checkAsync<T>(actual: T): CheckResultAsync<T>;
export declare const check: typeof checkSync & {
    async: typeof checkAsync;
};
