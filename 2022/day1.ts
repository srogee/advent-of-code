import { readInputFile, sum } from './utils';

function part1() {
    return getTopN(1);
}

function part2() {
    return getTopN(3);
}

function getTopN(n: number) {
    const input = readInputFile(1).split("\n");
    let caloriesByElf: number[] = [];
    let totalCalories = 0;

    for (const line of input) {
        const lineCalories = parseInt(line);

        if (isNaN(lineCalories)) {
            caloriesByElf.push(totalCalories);
            totalCalories = 0;
        } else {
            totalCalories += lineCalories;
        }
    }

    caloriesByElf.sort((a, b) => b - a);
    return sum(caloriesByElf.slice(0, n));
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);