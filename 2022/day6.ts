import { readInputFile } from './utils';

function part1() {
    return findFirstUniqueMarker(4);
}

function part2() {
    return findFirstUniqueMarker(14);
}

function findFirstUniqueMarker(size: number) {
    const input = readInputFile(6).split("");
    return input.findIndex((_, index) => areCharactersDistinct(input.slice(index, index + size).join(""))) + size;
}

function areCharactersDistinct(input: string) {
    return new Set(input.split("")).size === input.length;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);