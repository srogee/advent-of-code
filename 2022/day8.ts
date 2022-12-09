import { isValidIndex, readInputFile } from './utils';

export const part1 = () => {
    const trees = new TreePlot(readInputFile().split("\n"));
    let count = 0;
    trees.forEach((x, y) => {
        if (trees.isTreeVisible(x, y)) {
            count++;
        }
    });
    return count;
}
export const part2 = () => 0;

class TreePlot {
    private data: Tree[][];

    constructor(input: string[]) {
        this.data = input.map(line => line.split("").map(char => Tree.fromString(char)));
    }

    public isTreeVisible(x: number, y: number) {
        return this.isTreeVisibleInLine(x, y, 1, 0) || this.isTreeVisibleInLine(x, y, 0, 1) || this.isTreeVisibleInLine(x, y, -1, 0) || this.isTreeVisibleInLine(x, y, 0, -1);
    }

    public forEach(func: (x: number, y: number) => void) {
        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                func(x, y);
            }
        }
    }

    private isTreeVisibleInLine(x: number, y: number, dx: number, dy: number) {
        const tree = this.getTreeAt(x, y);
        if (tree) {
            const treeLine = this.getTreeLine(x, y, dx, dy);
            const maxHeight = Math.max(...treeLine.map(tree => tree.height));
            return tree.height > maxHeight;
        } else {
            return false;
        }
    }

    private getTreeLine(x: number, y: number, dx: number, dy: number): Tree[] {
        const result: Tree[] = [];
        let currentTree: Tree | undefined;
        do {
            x += dx;
            y += dy;
            currentTree = this.getTreeAt(x, y);
            if (currentTree) {
                result.push(currentTree);
            }
        } while (currentTree);

        return result;
    }

    private getTreeAt(x: number, y: number) {
        if (isValidIndex(this.data, y) && isValidIndex(this.data[y], x)) {
            return this.data[y][x];
        } else {
            return undefined;
        }
    }
}

class Tree {
    public height: number;

    constructor(height: number) {
        this.height = height;
    }

    static fromString(height: string) {
        return new Tree(parseInt(height));
    }
}