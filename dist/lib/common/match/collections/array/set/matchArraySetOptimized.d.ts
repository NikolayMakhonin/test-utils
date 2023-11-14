import { MatchArraySetOptions } from './contracts';
import { MatchResult, MatchResult2 } from "../../../contracts";
export declare function matchArraySetOptimized<T>(actual: T[], expected: T[], isMatcher: (value: any) => boolean, match: (actual: T, expected: T) => MatchResult<T>, options: MatchArraySetOptions): MatchResult2;
