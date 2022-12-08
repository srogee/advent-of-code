export const dayId = 7;

async function run() {
    const { part1, part2 } = await import("./day" + dayId);
    console.log(`Part 1: ${part1()}`);
    console.log(`Part 2: ${part2()}`);
}

run();