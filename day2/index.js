import { open } from "node:fs/promises";
import { createInterface } from "readline";

async function main() {
  const file = await open("./puzzle.txt");
  const rl = createInterface({
    input: file.createReadStream(),
    crlfDelay: Infinity,
  });

  const possibleGameIndexes = [];

  for await (const line of rl) {
    const index = checkIfGameIsPossible(line);

    if (index) {
      possibleGameIndexes.push(index);
    }
  }

  const finalValue = possibleGameIndexes.reduce((val, acc) => {
    return acc + val;
  }, 0);
  console.log(finalValue);
}

main();

function checkIfGameIsPossible(line) {
  const id = getId(line);

  const choices = getChoices(line, id);

  return checkIfPossible(choices);
}

function getId(line) {
  const target = line.split(":")[0];
  return getNumberFromString(target);
}

function getChoices(line, id) {
  const obj = {};

  const target = line.split(":")[1];
  const games = target.split(";");

  games.forEach((game, index) => {
    const tries = game.split(",");
    tries.forEach((t) => {
      if (!obj[index]) {
        obj[index] = {};
      }
      const number = getNumberFromString(t);
      const color = t.split(" ")[2];

      obj[index][color] = number;
    });
  });

  return obj;
}

function checkIfPossible(choices) {
  let maxValues = {
    green: 0,
    red: 0,
    blue: 0,
  };

  for (const [_, firstValue] of Object.entries(choices)) {
    for (const [secondKey, secondValue] of Object.entries(maxValues)) {
      if (firstValue[secondKey] > secondValue) {
        maxValues[secondKey] = firstValue[secondKey];
      }
    }
  }

  let result = 1;

  Object.entries(maxValues).forEach(([_, value]) => {
    result = result * value;
  });

  return result;
}

function getNumberFromString(string) {
  return +string.replace(/\D+/g, "");
}
