import { Expected } from './contracts';
import { Matcher } from './Matcher';
export declare function isIterator(obj: any): obj is Iterator<any>;
export declare function isIterable(obj: any): obj is Iterable<any>;
export declare function isSyncMatcher<T>(expected: Expected<T>): expected is Matcher<T, false>;
