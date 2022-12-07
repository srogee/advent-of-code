import { groupByN, intersect, partition, readInputFile, sum } from './utils';

export function part1() {
    const input = readInputFile().split("\n");
    return sum(input.filter(line => line.length > 0).map(line => getRucksackSharedItemPriority(line)));
}

export function part2() {
    const input = readInputFile().split("\n");
    const grouped = groupByN(input.filter(line => line.length > 0), 3);
    return sum(grouped.map(rucksacksInGroup => getBadgeItemPriority(rucksacksInGroup)));
}

function getRucksackSharedItemPriority(rucksackContents: string) : number {
    const compartments = partition(rucksackContents.split(""), 2).map(compartment => new Set(compartment));
    return getItemPriority([ ...intersect(compartments[0], compartments[1]) ][0]);
}

function getItemPriority(item: string) : number {
    const charCode = item.charCodeAt(0);

    // a-z -> 1-26
    // A-Z -> 27-52

    return charCode - 97 >= 0 ? charCode - 97 + 1 : charCode - 65 + 27;
}

function getBadgeItemPriority(rucksacksInGroup: string[]) : number {
    const sets = rucksacksInGroup.map(rucksackContents => new Set(rucksackContents.split("")));
    const intersection = intersect(sets[0], intersect(sets[1], sets[2]));
    return getItemPriority([ ...intersection ][0]);
}