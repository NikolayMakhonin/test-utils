import { MatchMapOptions } from './contracts';
export declare function matchMap<T>(actual: Map<any, T>, expected: Map<any, T>, match: (actual: T, expected: T) => boolean, options: MatchMapOptions): boolean;
