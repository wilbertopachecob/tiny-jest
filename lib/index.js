const chalk = require("chalk");
let totalTest = 0;
let passed = 0;
let failed = 0;

function describe(title, fn) {
  console.log(title);
  fn();
}

function it(title, fn) {
  console.log(title);
  fn();
  totalTest++;
}

function expect(value) {
  return {
    toBe: function (expected) {
      if (value === expected) {
        console.log(chalk.green(`expect ${value} to be ${expected}`));
        passed++;
      } else {
        console.log(chalk.red(`expect ${value} to be ${expected}`));
        failed++;
      }
    },
    toEqual: function (expected) {
      if (value == expected) {
        console.log(chalk.green(`expect ${value} to be ${expected}`));
        passed++;
      } else {
        console.log(chalk.red(`expect ${value} to be ${expected}`));
        failed++;
      }
    },
  };
}

exports.showTestsResults = function showTestsResults() {
  console.log("Passed: ", passed);
  console.log("Failed: ", failed);
  console.log("Total: ", totalTest);
};

global.describe = describe;
global.it = it;
global.expect = expect;
