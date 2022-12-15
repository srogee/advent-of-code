import { readInputFile, Array2D, Vector2 } from './utils';

export const part1 = () => {
    const { heightmap, start, end } = parseInput();
    return getShortestPathLength(heightmap, [start], end);
}

export const part2 = () => {
    const { heightmap, end } = parseInput();
    const startingPoints: Vector2[] = [];
    for (let x = 0; x < heightmap.width; x++) {
        for (let y = 0; y < heightmap.height; y++) {
            if (heightmap.get(x, y) === 1) {
                startingPoints.push(new Vector2(x, y));
            }
        }
    }
    return getShortestPathLength(heightmap, startingPoints, end);
}

function getShortestPathLength(heightmap: Array2D<number>, startingPoints: Vector2[], goal: Vector2): number {
    const gScore = new Array2D<number>();
    const fScore = new Array2D<number>();
    const cameFrom = new Array2D<Vector2>();
    const neighbors = new Array2D<Vector2[]>();
    const openSet: Vector2[] = [];
    const neighborDirections = [ Vector2.up, Vector2.down, Vector2.left, Vector2.right ];

    function heuristic(vector: Vector2) {
        return Math.abs(vector.x - goal.x) + Math.abs(vector.y - goal.y);
    }

    for (let x = 0; x < heightmap.width; x++) {
        for (let y = 0; y < heightmap.width; y++) {
            const vertexPos = new Vector2(x, y);
            gScore.set(vertexPos, Infinity);
            fScore.set(vertexPos, Infinity);
            neighbors.set(vertexPos, neighborDirections.map(dir => Vector2.add(vertexPos, dir)).filter(neighborPos => heightmap.isValidIndex(neighborPos) && heightmap.get(neighborPos)! - heightmap.get(vertexPos)! <= 1));
            openSet.push(vertexPos);
        }
    }

    for (const start of startingPoints) {
        gScore.set(start, 0);
        fScore.set(start, heuristic(start));
    }
    
    while (openSet.length > 0) {
        let current : Vector2 | undefined = openSet.sort((a, b) => gScore.get(a.x, a.y)! - gScore.get(b.x, b.y)!).shift()!;

        if (Vector2.equal(current, goal)) {
            let length = 0;
            if (cameFrom.get(current) || startingPoints.some(start => current!.equals(start))) {
                while (current) {
                    length++;
                    current = cameFrom.get(current);
                }
            }
            return length - 1;
        }

        for (const neighbor of neighbors.get(current)!) {
            const tentativeGScore = gScore.get(current)! + Vector2.distance(current, neighbor);
            if (tentativeGScore < gScore.get(neighbor)!) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic(neighbor));
                if (!openSet.some(node => node.equals(neighbor))) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return Infinity;
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