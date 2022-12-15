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
    if (array.length === 0) {
        return 0;
    }
    return array.reduce((runningTotal, element) => runningTotal + element);
}

/**
 * Returns the product of the elements in a numeric array.
 * @param array Input array
 * @returns Product of array elements
 */
export function product(array: number[]) {
    if (array.length === 0) {
        return 0;
    }
    return array.reduce((runningTotal, element) => runningTotal * element);
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

/**
 * Checks if a number is a valid index in an array
 * @param array The array to check
 * @param index The zero based index to check
 * @returns True if valid, false otherwise
 */
export function isValidIndex<T>(array: T[], index: number) {
    return array && index >= 0 && index <= array.length;
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static subtract(a: Vector2, b: Vector2) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static equal(a: Vector2, b: Vector2) {
        return a.x === b.x && a.y === b.y;
    }

    static distance(a: Vector2, b: Vector2) {
        return Vector2.subtract(a, b).length();
    }

    equals(other: Vector2) {
        return Vector2.equal(this, other);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    static zero = new Vector2(0, 0);
    static up = new Vector2(0, -1);
    static down = new Vector2(0, 1);
    static left = new Vector2(-1, 0);
    static right = new Vector2(1, 0);
}

export class Array2D<T>{
    data: T[][];
    width: number;
    height: number;

    constructor() {
        this.width = 0;
        this.height = 0;
        this.data = [];
    }

    get(x: number, y: number): T | undefined;
    get(vector: Vector2): T | undefined;
    get(xOrVector: number | Vector2, y?: number): T | undefined {
        if (xOrVector instanceof Vector2) {
            return this.getXY(xOrVector.x, xOrVector.y);
        } else {
            return this.getXY(xOrVector, y as number);
        }
    }

    set(vector: Vector2, value: T) : void;
    set(x: number, y: number, value: T) : void;
    set(xOrVector: number | Vector2, yOrValue: number | T, value?: T) : void {
        if (xOrVector instanceof Vector2) {
            this.setXY(xOrVector.x, xOrVector.y, yOrValue as T);
        } else {
            this.setXY(xOrVector, yOrValue as number, value as T);
        }
    }

    map<U>(func: (element: T | undefined, x: number, y: number) => U): Array2D<U> {
        const array = new Array2D<U>();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                array.set(x, y, func(this.get(x, y), x, y));
            }
        }
        return array;
    }

    print() {
        for (let y = 0; y < this.height; y++) {
            let str = "";
            for (let x = 0; x < this.width; x++) {
                str += this.get(x, y);
            }
            console.log(str);
        }
    }

    isValidIndex(xOrVector: number | Vector2, y?: number): boolean {
        if (xOrVector instanceof Vector2) {
            return this.isValidIndexXY(xOrVector.x, xOrVector.y);
        } else {
            return this.isValidIndexXY(xOrVector, y as number);
        }
    }

    private getXY(x: number, y: number) {
        if (this.isValidIndexXY(x, y)) {
            return this.data[y][x];
        } else {
            return undefined;
        }
    }

    private setXY(x: number, y: number, value: T) {
        this.width = Math.max(this.width, x + 1);
        this.height = Math.max(this.height, y + 1);

        while (this.data.length < this.height) {
            this.data.push([]);
        }

        this.data[y][x] = value;
    }

    private isValidIndexXY(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
}