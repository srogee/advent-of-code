import { readInputFile } from './utils';

export const part1 = () => findFirstUniqueMarker(4);
export const part2 = () => findFirstUniqueMarker(14);

function findFirstUniqueMarker(size: number) {
    const input = readInputFile().split("");
    return input.findIndex((_, index) => areCharactersDistinct(input.slice(index, index + size).join(""))) + size;
}

function areCharactersDistinct(input: string) {
    return new Set(input.split("")).size === input.length;
}