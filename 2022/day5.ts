import { readInputFile } from './utils';

type Stack = string[];

function part1() {
    return doTheStacking(false);
}

function part2() {
    return doTheStacking(true);
}

function doTheStacking(canMoveMultipleAtOnce: boolean) {
    const [ stackDefinitions, moveDirectives ] = readAndParseInput();
    const stacks = applyMoveDirectives(parseStacks(stackDefinitions), moveDirectives, canMoveMultipleAtOnce);
    return stacks.map(stack => stack[stack.length - 1]).join("");
}

function readAndParseInput() {
    const input = readInputFile(5).split("\n");
    const stackDefinitions: string[] = [];
    const moveDirectives: string[] = [];
    for (const line of input) {
        if (line.startsWith("[")) {
            stackDefinitions.push(line);
        } else if (line.startsWith("move")) {
            moveDirectives.push(line);
        }
    }

    return [ stackDefinitions, moveDirectives ];
}

function parseStacks(input: string[]) {
    const stacks: Stack[] = [];

    for (const line of input) {
        let stackIndex = 0;
        for (let charIndex = 1; charIndex < line.length; charIndex += 4) {
            if (stackIndex >= stacks.length) {
                stacks.push([]);
            }

            const crate = line.charAt(charIndex);
            if (crate !== " ") {
                stacks[stackIndex].unshift(crate);
            }

            stackIndex++;
        }
    }

    return stacks;
}

function applyMoveDirectives(stacks: Stack[], moveDirectives: string[], canMoveMultipleAtOnce: boolean) {
    for (const moveDirective of moveDirectives) {
        const split = moveDirective.split(" ");
        
        const count = parseInt(split[1]);
        const from = parseInt(split[3]) - 1;
        const to = parseInt(split[5]) - 1;

        if (canMoveMultipleAtOnce) {
            moveCrates(stacks, from, to, count);
        } else {
            for (let index = 0; index < count; index++) {
                moveCrates(stacks, from, to, 1);
            }
        }
    }

    return stacks;
}

function moveCrates(stacks: Stack[], from: number, to: number, count: number) {
    const crates = stacks[from].splice(stacks[from].length - count, count);
    stacks[to] = stacks[to].concat(crates);
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);