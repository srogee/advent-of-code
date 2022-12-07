import fs from 'fs';
import path from 'path';
import { dayId } from "./runner"; 

/**
 * Reads an input file contents for the given day
 * @param day Day (1-based)
 * @returns Input file contents as a string
 */
export function readInputFile() {
    return fs.readFileSync(path.join(__dirname, `input-day${dayId}.txt`), { encoding: "utf8" });
}

/**
 * Returns the sum of the elements in a numeric array.
 * @param array Input array
 * @returns Sum of array elements
 */
export function sum(array: number[]) {
    return array.reduce((runningTotal, element) => runningTotal + element);
}

/**
 * Returns the modulo of a number by n. Supports wrapping negative values (e.g. modulo(-1, 3) returns 3)
 * @param number Number to be modded
 * @param n Number doing the modding
 * @returns Modded number
 */
export function modulo(number: number, n: number) {
    return ((number % n) + n) % n;
}

/**
 * Returns the intersection of two sets (all elements that appear in both sets)
 * @param a First set
 * @param b Second set
 * @returns Set intersection
 */
export function intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set([ ...a ].filter(x => b.has(x)));
}

/**
 * A nicer version of Array.reduce that has separate types for the cumulative value and the array elements.
 * @param array Array to reduce
 * @param callback A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
 */
export function reduce<T, V>(array: T[], callback: (previousValue: V, element: T, currentIndex: number, array: T[]) => V, initialValue?: V): V {
    return array.reduce(callback as any, initialValue as any) as any;
}

/**
 * Groups the elements of an array into groups of size N
 * @param array Array to group
 * @param n Size of each group
 * @returns Array of arrays, each with length <= n
 */
export function groupByN<T>(array: T[], n: number) {
    return reduce<T, T[][]>(array, (groupedArray, element) => {
        if (groupedArray[groupedArray.length - 1].length >= n) {
            groupedArray.push([]);
        }
        groupedArray[groupedArray.length - 1].push(element);
        return groupedArray;
    }, [[]]);
}

/**
 * Groups the elements of an array into N groups
 * @param array Array to group
 * @param n Number of groups
 * @returns Array of arrays, each with length <= Math.ceil(array.length / n)
 */
export function partition<T>(array: T[], n: number) {
    return groupByN(array, Math.ceil(array.length / n));
}