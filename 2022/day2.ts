import { modulo, readInputFile, sum } from './utils';

function part1() {
    const input = readInputFile(2).split("\n");
    return sum(input.map(line => getScoreForRoundPart1(line)));
}

function getScoreForRoundPart1(input: string) {
    const split = input.split(" ");

    if (split.length === 2) {
        const opponentShape = getShapeFromInput(split[0]);
        const yourShape = getShapeFromInput(split[1]);
        const yourShapeScore = yourShape + 1;
        const outcomeScore = getOutcomeScoreFromShape(opponentShape, yourShape);
        return yourShapeScore + outcomeScore;
    } else {
        return 0;
    }
}

function part2() {
    const input = readInputFile(2).split("\n");
    return sum(input.map(line => getScoreForRoundPart2(line)));
}

function getScoreForRoundPart2(input: string) {
    const split = input.split(" ");

    if (split.length === 2) {
        const opponentShape = getShapeFromInput(split[0]);
        const outcomeScore = getOutcomeScoreFromDesiredOutcome(split[1]);
        const yourShape = getShapeFromOutcomeScore(opponentShape, outcomeScore);
        const yourShapeScore = yourShape + 1;
        return yourShapeScore + outcomeScore;
    } else {
        return 0;
    }
}

enum Shape {
    Rock = 0,
    Paper = 1,
    Scissors = 2
}

function getShapeFromInput(input: string) {
    // A = 65 - 65 -> 0
    // B = 66 - 65 -> 1
    // C = 67 - 65 -> 2
    // X = 88 - 88 -> 0
    // Y = 89 - 88 -> 1
    // Z = 90 - 88 -> 2
    
    const charCode = input.charCodeAt(0);
    return Math.min(Math.abs(charCode - 65), Math.abs(charCode - 88));
}

function getOutcomeScoreFromDesiredOutcome(input: string) {
    // X = 0 * 3 -> 0
    // Y = 1 * 3 -> 3
    // Z = 2 * 3 -> 6

    return getShapeFromInput(input) * 3;
}

function getOutcomeScoreFromShape(opponentShape: Shape, yourShape: Shape) {
    const diff = opponentShape - yourShape;

    // opponent rock (0), your scissors (2) -> 0
    // opponent paper (1), your rock (0) -> 0
    // opponent scissors (2), your paper (1) -> 0

    // opponent rock (0), your rock (0) -> 3
    // opponent paper (1), your paper (1) -> 3
    // opponent scissors (2), your scissors (2) -> 3
    
    // opponent rock (0), your paper (1) -> 6
    // opponent paper (1), your scissors (2) -> 6
    // opponent scissors (2), your rock (0) -> 6

    switch (diff) {
        case 0: return 3;
        case -1: return 6;
        case 2: return 6;
    }

    return 0;
}

function getShapeFromOutcomeScore(opponentShape: Shape, outcomeScore: number) {
    const normalizedScore = outcomeScore / 3 - 1; // -1, 0, 1

    // opponent rock (0), outcome 0 -> scissors (2)
    // opponent paper (1), outcome 0 -> rock (0)
    // opponent scissors (2), outcome 0 -> paper (1)

    // opponent rock (0), outcome 3 -> rock (0)
    // opponent paper (1), outcome 3 -> paper (1)
    // opponent scissors (2), outcome 3 -> scissors (2)

    // opponent rock (0), outcome 6 -> paper (1)
    // opponent paper (1), outcome 6 -> scissors (2)
    // opponent scissors (2), outcome 6 -> rock (0)

    return modulo(opponentShape + normalizedScore, 3);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);