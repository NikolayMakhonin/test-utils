import { MatchArraySequenceOptions } from './contracts';
import { MatchResult, MatchResult2 } from "../../../contracts";
export declare function matchArraySequence(actual: number[], expected: number[], isMatcher: (value: any) => boolean, match: (actual: number, expected: number) => MatchResult<number>, options: MatchArraySequenceOptions): MatchResult2;
