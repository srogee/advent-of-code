export const dayId = 12;

async function run() {
    const { part1, part2 } = await import("./day" + dayId);
    let startTime = Date.now();
    const part1Result = part1();
    const part1Elapsed = Date.now() - startTime;
    startTime = Date.now();
    const part2Result = part2();
    const part2Elapsed = Date.now() - startTime;
    console.log(`Part 1: ${part1Result} (${part1Elapsed}ms)`);
    console.log(`Part 2: ${part2Result} (${part2Elapsed}ms)`);
}

run();