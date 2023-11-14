import { MatcherContext } from 'expect';
export declare type CustomMatch = <Context extends MatcherContext = MatcherContext>(this: Context, received: unknown) => {
    pass: boolean;
    message: string | (() => string);
};
