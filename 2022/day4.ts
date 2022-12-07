import { readInputFile } from './utils';

export function part1() {
    const input = readInputFile().split("\n");
    return input.filter(line => line.length > 0).filter(pair => doesOneRangeContainTheOther(pair)).length;
}

export function part2() {
    const input = readInputFile().split("\n");
    return input.filter(line => line.length > 0).filter(pair => doRangesOverlap(pair)).length;
}

function doesOneRangeContainTheOther(pair: string) {
    const ranges = Range.fromStringPair(pair);
    return ranges[0].contains(ranges[1]) || ranges[1].contains(ranges[0]);
}

function doRangesOverlap(pair: string) {
    const ranges = Range.fromStringPair(pair);
    return ranges[0].overlaps(ranges[1]);
}

class Range {
    public start: number;
    public end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    public static fromStringRange(input: string) : Range {
        const split = input.split("-").map(element => parseInt(element));
        return new Range(split[0], split[1]);
    }

    public static fromStringPair(input: string) : Range[] {
        return input.split(",").map(element => Range.fromStringRange(element));
    }

    public contains(other: Range) : boolean {
        return this.start <= other.start && this.end >= other.end;
    }

    public overlaps(other: Range) : boolean {
        return this.start <= other.end && this.end >= other.start;
    }
}