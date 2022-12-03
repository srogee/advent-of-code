import { readInputFile, sum } from './utils';

function run() {
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
    return sum(caloriesByElf.slice(0, 3));
}

console.log(run());