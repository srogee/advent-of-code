import { readInputFile } from './utils';

export const part1 = () => 0;//playKeepAway(20, true);
export const part2 = () => playKeepAway(10000, false);

function playKeepAway(rounds: number, divideByThree: boolean) {
    const input = readInputFile().split("\n");
    const monkeys: Monkey[] = [];

    for (let lineIndex = 0; lineIndex < input.length; lineIndex++) {
        if (input[lineIndex].startsWith("Monkey ")) {
            monkeys.push(Monkey.fromInput(input, lineIndex));
        }
    }

    for (let roundIndex = 0; roundIndex < rounds; roundIndex++) {
        console.log(`Round ${roundIndex}`);
        for (const monkey of monkeys) {
            monkey.takeTurn(monkeys, divideByThree);
        }
    }

    // for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex++) {
    //     console.log(`Monkey ${monkeyIndex} inspected items ${monkeys[monkeyIndex].numItemsInspected} times.`);
    //     console.log(`\t${monkeys[monkeyIndex].items.join(", ")}`);
    // }

    monkeys.sort((a, b) => b.numItemsInspected - a.numItemsInspected);
    return monkeys[0].numItemsInspected * monkeys[1].numItemsInspected;
}

interface Operation {
    run(old: bigint) : bigint;
}

class AddOperation {
    constructor(operand: bigint) {
        this.operand = operand;
    }
    operand: bigint;
    run(old: bigint) : bigint {
        return old + this.operand;
    }
}

class MultiplyOperation {
    constructor(operand: bigint) {
        this.operand = operand;
    }
    operand: bigint;
    run(old: bigint) : bigint {
        return old * this.operand;
    }
}

class SquareOperation {
    run(old: bigint) : bigint {
        return old * old;
    }
}

class Monkey {
    items: bigint[] = [];
    operation: Operation | null = null;
    testDivisor: bigint = -1n;
    testTrueMonkeyIndex: number = -1;
    testFalseMonkeyIndex: number = -1;
    numItemsInspected: number = 0;

    static fromInput(input: string[], startIndex: number) {
        const monkey = new Monkey();
        monkey.items = input[startIndex + 1].substring(18).split(", ").map(num => BigInt(num));
        monkey.operation = this.parseOperation(input[startIndex + 2].substring(19));
        monkey.testDivisor = BigInt(input[startIndex + 3].substring(21));
        monkey.testTrueMonkeyIndex = parseInt(input[startIndex + 4].substring(29));
        monkey.testFalseMonkeyIndex = parseInt(input[startIndex + 5].substring(30));
        return monkey;
    }

    static parseOperation(operation: string) : Operation | null {
        const operands = operation.split(" ");

        switch (operands[1]) {
            case "+": return new AddOperation(BigInt(operands[2]));
            case "*": return operands[2] === "old" ? new SquareOperation() : new MultiplyOperation(BigInt(operands[2]));
        }

        return null;
    }

    takeTurn(monkeys: Monkey[], divideByThree: boolean) {
        for (const item of this.items) {
            let worryLevel = item;
            worryLevel = this.runOperation(worryLevel);
            if (divideByThree) {
                worryLevel = worryLevel / 3n;
            }
            const newMonkey = this.runTest(worryLevel);
            monkeys[newMonkey].items.push(worryLevel);
            this.numItemsInspected++;
        }

        this.items = [];
    }

    runOperation(old: bigint) : bigint {
        return this.operation!.run(old);
    }

    runTest(num: bigint) : number {
        return (num % this.testDivisor == 0n) ? this.testTrueMonkeyIndex : this.testFalseMonkeyIndex;
    }
}