import { open } from "node:fs/promises";
import { createInterface } from "readline";

async function main() {
  const file = await open("./puzzle.txt");
  const rl = createInterface({
    input: file.createReadStream(),
    crlfDelay: Infinity,
  });

  const calibrationValues = [];

  for await (const line of rl) {
    const lineNumbers = [];
    for (let i = 0; i < line.length; i++) {
      const int = parseInt(line[i]);
      if (int) {
        lineNumbers.push(int);
      }
    }
    if (lineNumbers.length === 0) {
      return;
    }
    if (lineNumbers.length === 1) {
      calibrationValues.push(parseInt(`${lineNumbers[0]}${lineNumbers[0]}`));
    } else {
      calibrationValues.push(
        parseInt(`${lineNumbers[0]}${lineNumbers[lineNumbers.length - 1]}`)
      );
    }
  }
  const finalValue = calibrationValues.reduce((val, acc) => {
    return acc + val;
  }, 0);
  console.log(finalValue);
}

main();
