import { readInputFile } from './utils';

export const part1 = () => simulate(2);
export const part2 = () => simulate(10);

class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static subtract(a: Vector2, b: Vector2) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    static zero = new Vector2(0, 0);
    static up = new Vector2(0, -1);
    static down = new Vector2(0, 1);
    static left = new Vector2(-1, 0);
    static right = new Vector2(1, 0);
}

class Rope {
    knotPositions: Vector2[];
    tailVisitedPositions: Vector2[];

    constructor(length: number) {
        this.knotPositions = [];

        for (let index = 0; index < length; index++) {
            this.knotPositions.push(Vector2.zero.copy());
        }

        this.tailVisitedPositions =[ Vector2.zero.copy() ];
    }

    moveHead(delta: Vector2) {
        this.knotPositions[0] = Vector2.add(this.knotPositions[0], delta);
        for (let index = 1; index < this.knotPositions.length; index++) {
            const previousKnotDelta = Vector2.subtract(this.knotPositions[index - 1], this.knotPositions[index]);

            if ((Math.abs(previousKnotDelta.x) >= 2 && previousKnotDelta.y === 0) || (Math.abs(previousKnotDelta.y) >= 2 && previousKnotDelta.x === 0) || (Math.abs(previousKnotDelta.x) >= 2 || Math.abs(previousKnotDelta.y) >= 2)) {
                this.knotPositions[index] = Vector2.add(this.knotPositions[index], new Vector2(Math.sign(previousKnotDelta.x), Math.sign(previousKnotDelta.y)));
            }
        }

        const tailPosition = this.knotPositions[this.knotPositions.length - 1];
        if (!this.tailVisitedPositions.find(pos => pos.x === tailPosition.x && pos.y === tailPosition.y)) {
            this.tailVisitedPositions.push(tailPosition.copy());
        }
    }
}

function simulate(ropeLength: number) {
    const moveDirectives = getMoveDirectives();
    const rope = new Rope(ropeLength);

    for (const directive of moveDirectives) {
        for (let index = 0; index < directive.distance; index++) {
            rope.moveHead(directive.direction);
        }
    }

    return rope.tailVisitedPositions.length;
}

function getMoveDirectives() {
    const input = readInputFile().split("\n").filter(line => line.length > 0);
    return input.map(line => MoveDirective.fromString(line));
}

class MoveDirective {
    direction: Vector2;
    distance: number;

    static directionMap = new Map([
        [ "U", Vector2.up ],
        [ "D", Vector2.down ],
        [ "L", Vector2.left ],
        [ "R", Vector2.right ],
    ]);

    constructor(direction: Vector2, distance: number) {
        this.direction = direction;
        this.distance = distance;
    }

    static fromString(input: string) {
        const split = input.split(" ");
        const direction = MoveDirective.directionMap.get(split[0])!;
        const distance = parseInt(split[1]);
        return new MoveDirective(direction, distance);
    }
}