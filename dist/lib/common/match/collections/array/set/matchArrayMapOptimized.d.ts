import { MatchArraySetOptions } from './contracts';
import { MatchResult, MatchResult2 } from "../../../contracts";
export declare function matchArrayMapOptimized<T>(actual: T[], expected: T[], getKey: (value: T) => any, match: (actual: T, expected: T) => MatchResult<number>, options: MatchArraySetOptions): MatchResult2;
