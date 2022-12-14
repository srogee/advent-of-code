import { readInputFile } from './utils';

type Stack = string[];

export const part1 = () => doTheStacking(false);
export const part2 = () => doTheStacking(true);

function doTheStacking(canMoveMultipleAtOnce: boolean) {
    const [ stackDefinitions, moveDirectives ] = readAndParseInput();
    const stacks = applyMoveDirectives(parseStacks(stackDefinitions), moveDirectives, canMoveMultipleAtOnce);
    return stacks.map(stack => stack[stack.length - 1]).join("");
}

function readAndParseInput() {
    const input = readInputFile().split("\n");
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

        moveCrates(stacks, from, to, count, canMoveMultipleAtOnce);
    }

    return stacks;
}

function moveCrates(stacks: Stack[], from: number, to: number, count: number, canMoveMultipleAtOnce: boolean) {
    const crates = stacks[from].splice(stacks[from].length - count, count);
    if (!canMoveMultipleAtOnce) {
        crates.reverse();
    }
    stacks[to] = stacks[to].concat(crates);
}