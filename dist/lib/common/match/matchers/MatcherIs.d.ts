import { Matcher } from '../Matcher';
export declare class MatcherIs<T = any> extends Matcher<T> {
    private readonly _expected;
    private readonly _nonStrict;
    constructor(expected: T, nonStrict?: boolean);
    get async(): false;
    match(actual: any): boolean;
    toString(): string;
}
