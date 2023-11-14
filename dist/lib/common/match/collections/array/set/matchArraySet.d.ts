import { MatchArraySetOptions } from './contracts';
import { MatchResult, MatchResult2 } from "../../../contracts";
export declare function shouldUseOptimized(actual: any[], expected: any[], isMatcher: (value: any) => boolean, options: MatchArraySetOptions): boolean;
export declare function matchArraySet<T>(actual: T[], expected: T[], isMatcher: (value: any) => boolean, match: (actual: T, expected: T) => MatchResult<T>, options: MatchArraySetOptions): MatchResult2;
