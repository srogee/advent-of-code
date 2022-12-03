import { readInputFile, sum } from './utils';

function run() {
    const input = readInputFile(2).split("\n");
    return sum(input.map(line => getScoreForRound(line)));
}

function getScoreForRound(input: string) {
    const split = input.split(" ");

    if (split.length === 2) {
        const opponentShape = getShapeFromInput(split[0]);
        const yourShape = getShapeFromInput(split[1]);
        const yourShapeScore = yourShape + 1;
        const outcomeScore = getOutcomeScore(opponentShape, yourShape);
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
    const charCode = input.charCodeAt(0);
    return Math.min(Math.abs(charCode - 65), Math.abs(charCode - 88));
}

function getOutcomeScore(opponentShape: Shape, yourShape: Shape) {
    const diff = opponentShape - yourShape;
    
    switch (diff) {
        case 0: return 3;
        case -1: return 6;
        case 2: return 6;
    }

    return 0;
}

console.log(run());