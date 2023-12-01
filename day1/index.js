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
    const lineCalibration = findLineCalibration(line);
    calibrationValues.push(lineCalibration);
  }
  const finalValue = calibrationValues.reduce((val, acc) => {
    return acc + val;
  }, 0);
  console.log(finalValue);
}

main();

function findLineCalibration(line) {
  const words = findWords(line);
  const numbers = findNumbers(line);
  const lineNumbers = Object.entries({ ...words, ...numbers }).map(
    (pair) => pair[1]
  );
  if (lineNumbers.length === 0) {
    return;
  }
  if (lineNumbers.length === 1) {
    return parseInt(`${lineNumbers[0]}${lineNumbers[0]}`);
  } else {
    return parseInt(`${lineNumbers[0]}${lineNumbers[lineNumbers.length - 1]}`);
  }
}

function findWords(line) {
  const wordNumbersInLine = {};
  const wordNumberObject = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  const wordNumbersArray = Object.keys(wordNumberObject);

  for (let i = 0; i < wordNumbersArray.length; i++) {
    const elementKey = [
      ...line.matchAll(new RegExp(wordNumbersArray[i], "gi")),
    ].map((e) => e.index);
    elementKey.forEach((element) => {
      wordNumbersInLine[element] = wordNumberObject[wordNumbersArray[i]];
    });
  }
  return wordNumbersInLine;
}

function findNumbers(line) {
  const numbersInLine = {};

  for (let i = 0; i < line.length; i++) {
    const int = parseInt(line[i]);
    if (int) {
      numbersInLine[i] = int;
    }
  }

  return numbersInLine;
}
