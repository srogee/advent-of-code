import { groupByN, intersect, partition, readInputFile, sum } from './utils';

function part1() {
    const input = readInputFile(3).split("\n");
    return sum(input.filter(line => line.length > 0).map(line => getRucksackSharedItemPriority(line)));
}

function getRucksackSharedItemPriority(rucksackContents: string) : number {
    const compartments = partition(rucksackContents.split(""), 2);
    return getItemPriority([ ...intersect(new Set(compartments[0]), new Set(compartments[1])) ][0]);
}

function getItemPriority(item: string) : number {
    const charCode = item.charCodeAt(0);

    // a-z -> 1-26
    // A-Z -> 27-52

    return charCode - 97 >= 0 ? charCode - 97 + 1 : charCode - 65 + 27;
}

function part2() {
    const input = readInputFile(3).split("\n");
    const grouped = groupByN(input.filter(line => line.length > 0), 3);
    return sum(grouped.map(rucksacksInGroup => getBadgeItemPriority(rucksacksInGroup)));
}

function getBadgeItemPriority(rucksacksInGroup: string[]) : number {
    const sets = rucksacksInGroup.map(rucksackContents => new Set(rucksackContents.split("")));
    const intersection = intersect(sets[0], intersect(sets[1], sets[2]));
    return getItemPriority([ ...intersection ][0]);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);