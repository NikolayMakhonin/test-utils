import {MatchArraySetOptions} from "src/common/match/array/set/contracts";
export function matchArraySet<T>(
  actual: T[],
  expected: T[],
  match: (actual: T, expected: T) => boolean,
  options: MatchArraySetOptions,
): boolean {

}
