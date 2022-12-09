import { isValidIndex, product, readInputFile } from './utils';

export const part1 = () => {
    const trees = new TreePlot(readInputFile().split("\n"));
    return trees.getAllTrees().filter(tree => trees.isTreeVisible(tree)).length;
}

export const part2 = () => {
    const trees = new TreePlot(readInputFile().split("\n"));
    return Math.max(...trees.getAllTrees().map(tree => trees.getScenicScore(tree)));
}

class TreePlot {
    private data: Tree[][];
    private static directionVectors = [{ x: 1, y: 0}, { x: -1, y: 0}, { x: 0, y: 1}, { x: 0, y: -1}]

    constructor(input: string[]) {
        this.data = input.map(line => line.split("").map(char => Tree.fromString(char)));
        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                this.data[y][x].x = x;
                this.data[y][x].y = y;
            }
        }
    }

    public isTreeVisible(tree: Tree) {
        return TreePlot.directionVectors.some(dir => this.isTreeVisibleInLine(tree, dir.x, dir.y));
    }

    public getScenicScore(tree: Tree) {
        return product(TreePlot.directionVectors.map(dir => this.getViewDistance(tree, dir.x, dir.y)));
    }

    public getAllTrees() {
        const result: Tree[] = [];

        for (let y = 0; y < this.data.length; y++) {
            for (let x = 0; x < this.data[y].length; x++) {
                result.push(this.getTreeAt(x, y)!);
            }
        }

        return result;
    }

    private isTreeVisibleInLine(tree: Tree, dx: number, dy: number) {
        const treeLine = this.getTreeLine(tree, dx, dy);
        const maxHeight = Math.max(...treeLine.map(tree => tree.height));
        return tree.height > maxHeight;
    }

    private getViewDistance(tree: Tree, dx: number, dy: number) {
        const treeLine = this.getTreeLine(tree, dx, dy);
        let viewingDistance = 0;
        for (let index = 0; index < treeLine.length; index++) {
            viewingDistance++;
            if (treeLine[index].height >= tree.height) {
                break;
            }
        }
        return viewingDistance;
    }

    private getTreeLine(tree: Tree, dx: number, dy: number): Tree[] {
        const result: Tree[] = [];
        let currentTree: Tree | undefined = tree;
        let x = tree.x;
        let y = tree.y;
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
    public x: number;
    public y: number;
    public height: number;

    constructor(height: number) {
        this.x = 0;
        this.y = 0;
        this.height = height;
    }

    static fromString(height: string) {
        return new Tree(parseInt(height));
    }
}