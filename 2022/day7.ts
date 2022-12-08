import { readInputFile, sum } from './utils';

export const part1 = () => {
    const fs = buildFileSystem();
    const dirs = fs.getSubdirectoriesRecursively().filter(dir => dir.calculateSize() <= 100000);
    return sum(dirs.map(dir => dir.calculateSize()));
};

export const part2 = () => {
    const diskSize = 70000000;
    const updateSize = 30000000;
    const fs = buildFileSystem();
    const usedDiskSpace = fs.calculateSize();
    const dirs = fs.getSubdirectoriesRecursively().filter(dir => diskSize - usedDiskSpace + dir.calculateSize() >= updateSize);
    dirs.sort((a, b) => a.calculateSize() - b.calculateSize());
    return dirs[0].calculateSize();
};

function buildFileSystem() {
    const input = readInputFile().split("\n").filter(line => line.length > 0);
    const rootDirectory = new Directory("/", null);

    let currentDirectory = rootDirectory;
    let isLSOutput = false;

    for (const line of input) {
        if (line.startsWith("$ cd ")) {
            isLSOutput = false;
            const newDirectory = line.substring(5);
            if (newDirectory === "/") {
                currentDirectory = rootDirectory;
            } else if (newDirectory === "..") {
                currentDirectory = currentDirectory.parent!;
            } else {
                currentDirectory = currentDirectory.subdirectories.find(dir => dir.name === newDirectory)!;
            }
        } else if (line.startsWith("$ ls")) {
            isLSOutput = true;
        } else if (isLSOutput) {
            const fileOrDirectory = line.split(" ");
            if (line.startsWith("dir ")) {
                currentDirectory.subdirectories.push(new Directory(fileOrDirectory[1], currentDirectory));
            } else {
                currentDirectory.files.push({
                    size: parseInt(fileOrDirectory[0]),
                    name: fileOrDirectory[1]
                });
            }
        }
    }

    return rootDirectory;
}

class Directory {
    name: string;
    files: File[];
    subdirectories: Directory[];
    parent: Directory | null;

    constructor(name: string, parent: Directory | null) {
        this.name = name;
        this.parent = parent;
        this.files = [];
        this.subdirectories = [];
    }

    public getSubdirectoriesRecursively(): Directory[] {
        let array: Directory[] = [];

        for (const dir of this.subdirectories) {
            array.push(dir);
            array = array.concat(dir.getSubdirectoriesRecursively()); 
        }

        return array;
    }

    public calculateSize(): number {
        return sum(this.files.map(file => file.size)) + sum(this.subdirectories.map(dir => dir.calculateSize()));
    }
}

interface File {
    size: number,
    name: string
}