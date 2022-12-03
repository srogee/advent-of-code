import fs from 'fs';
import path from 'path';

export function readInputFile(day: number) {
    return fs.readFileSync(path.join(__dirname, `input-day${day}.txt`), { encoding: "utf8" });
}

export function sum(array: number[]) {
    return array.reduce((runningTotal, element) => runningTotal + element);
}