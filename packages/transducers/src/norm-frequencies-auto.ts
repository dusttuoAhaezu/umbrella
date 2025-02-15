import type { Fn } from "@thi.ng/api";
import type { Reducer } from "./api.js";
import { frequencies } from "./frequencies.js";
import { $$reduce } from "./reduce.js";

/**
 * Similar to {@link normFrequencies}, but automatically computes normalization
 * basis instead of requiring it ahead of time as argument.
 *
 * @example
 * ```ts
 * const items = [1, 2, 3, 1, 1, 4, 2, 5, 1, 2];
 *
 * normFrequenciesAuto(items)
 * // Map(5) { 1 => 0.4, 2 => 0.3, 3 => 0.1, 4 => 0.1, 5 => 0.1 }
 *
 * // frequencies by 1st letter
 * normFrequenciesAuto(x => x[0], ["alice", "abba", "bob", "charlie"])
 * // Map(3) { 'a' => 0.5, 'b' => 0.25, 'c' => 0.25 }
 * ```
 */
export function normFrequenciesAuto<A>(): Reducer<Map<A, number>, A>;
export function normFrequenciesAuto<A>(xs: Iterable<A>): Map<A, number>;
export function normFrequenciesAuto<A, B>(
	key: Fn<A, B>
): Reducer<Map<B, number>, A>;
export function normFrequenciesAuto<A, B>(
	key: Fn<A, B>,
	xs: Iterable<A>
): Map<B, number>;
export function normFrequenciesAuto(...args: any[]): any {
	const res = $$reduce(normFrequenciesAuto, args);
	if (res !== undefined) {
		return res;
	}
	const [init, complete, reduce] = frequencies(...(<[]>args));
	let norm = 0;
	return [
		init,
		(acc: Map<any, number>) => {
			acc = complete(acc);
			for (let p of acc) {
				acc.set(p[0], p[1] / norm);
			}
			return acc;
		},
		(acc: Map<any, number>, x: any) => (norm++, reduce(acc, x)),
	];
}
