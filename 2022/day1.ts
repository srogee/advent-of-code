import { readInputFile, sum } from './utils';

export const part1 = () => getTopN(1);
export const part2 = () => getTopN(3);

function getTopN(n: number) {
    const input = readInputFile().split("\n");
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