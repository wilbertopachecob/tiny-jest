const chalk = require("chalk");
let totalTest = 0;
let passed = 0;
let failed = 0;
let beforeEachs = [];
let afterEachs = [];

function beforeEach(fn) {
  beforeEachs.push(fn);
}

function afterEach(fn) {
  afterEachs.push(fn);
}

function describe(description, fn) {
  console.log(description);
  fn();
}

function it(description, fn) {
  totalTest++;
  console.log(description);

  for (const be of beforeEachs) {
    be.apply(this);
  }

  fn();

  for (const ae of afterEachs) {
    ae.apply(this);
  }
}

function expect(value) {
  return {
    isNot: false,
    get not() {
      this.isNot = true;
      return this;
    },
    toBe: function (expected) {
      if (this.isNot ? value !== expected : value === expected) {
        console.log(chalk.green(`expect ${value} to be ${expected}`));
        passed++;
      } else {
        console.log(chalk.red(`expect ${value} to be ${expected}`));
        failed++;
      }
    },
    toEqual: function (expected) {
      if (this.isNot ? value != expected : value == expected) {
        console.log(chalk.green(`expect ${value} to be ${expected}`));
        passed++;
      } else {
        console.log(chalk.red(`expect ${value} to be ${expected}`));
        failed++;
      }
    },
    toBeNull: function (expected) {
      if (this.isNot ? value !== null : value === null) {
        console.log(chalk.green(`expect ${value} to be ${expected}`));
        passed++;
      } else {
        console.log(
          chalk.green(`expect ${value} to be null but got ${expected} instead`)
        );
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
global.beforeEach = beforeEach;
global.afterEach = beforeEach;
