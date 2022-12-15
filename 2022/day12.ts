import { readInputFile, Array2D, Vector2 } from './utils';

export const part1 = () => {
    const { heightmap, start, end } = parseInput();
    return getShortestPathLength(heightmap, start, end);
}

export const part2 = () => {
    // const { heightmap, end } = parseInput();
    // const pathLengths: number[] = [];
    // for (let x = 0; x < heightmap.width; x++) {
    //     for (let y = 0; y < heightmap.height; y++) {
    //         if (heightmap.get(x, y) === 1) {
    //             pathLengths.push(getShortestPathLength(heightmap, new Vector2(x, y), end));
    //         }
    //     }
    // }
    // return pathLengths.sort((a, b) => a-b)[0];
    return 0;
}

function getShortestPathLength(heightmap: Array2D<number>, start: Vector2, end: Vector2): number {
    const dist = new Array2D<number>();
    const prev = new Array2D<Vector2>();
    const neighbors = new Array2D<Vector2[]>();
    const Q: Vector2[] = [];
    const neighborDirections = [ Vector2.up, Vector2.down, Vector2.left, Vector2.right ];

    for (let x = 0; x < heightmap.width; x++) {
        for (let y = 0; y < heightmap.width; y++) {
            const vertexPos = new Vector2(x, y);
            dist.set(vertexPos, Infinity);
            neighbors.set(vertexPos, neighborDirections.map(dir => Vector2.add(vertexPos, dir)).filter(neighborPos => heightmap.isValidIndex(neighborPos) && heightmap.get(neighborPos)! - heightmap.get(vertexPos)! <= 1));
            Q.push(vertexPos);
        }
    }

    dist.set(start.x, start.y, 0);
    
    while (Q.length > 0) {
        let u : Vector2 | undefined = Q.sort((a, b) => dist.get(a.x, a.y)! - dist.get(b.x, b.y)!).shift()!;

        if (Vector2.equal(u, end)) {
            let length = 0;
            if (prev.get(u) || u.equals(start)) {
                while (u) {
                    length++;
                    u = prev.get(u);
                }
            }
            return length - 1;
        }

        for (const neighbor of neighbors.get(u)!) {
            if (Q.find(v => v.equals(neighbor))) {
                const alt = dist.get(u)! + Vector2.subtract(neighbor, u).length();
                if (alt < dist.get(neighbor)!) {
                    dist.set(neighbor, alt);
                    prev.set(neighbor, u);
                }
            }
        }
    }

    return 0;
}

function parseInput() {
    const heightmap = new Array2D<number>();
    const input = readInputFile().split("\n");
    let start: Vector2 = Vector2.zero;
    let end: Vector2 = Vector2.zero;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const char = input[y][x];
            let height: number;
            if (char === "S") {
                start = new Vector2(x, y);
                height = 1;
            } else if (char === "E") {
                end = new Vector2(x, y);
                height = 26;
            } else {
                height = char.charCodeAt(0) - 96; // a -> 1, z -> 26
            }
            heightmap.set(x, y, height);
        }
    }

    return { heightmap, start, end };
}