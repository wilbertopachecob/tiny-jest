const chalk = require("chalk");
let totalTest = 0;
let passed = 0;
let failed = 0;
let beforeEachs = [];
let afterEachs = [];
const stats = [];
let currentDescription = {
  name: "",
  it: [],
};
let currentIt = {
  name: "",
  expects: [],
};

function getFilePath() {
  const filePath = new Error().stack?.split("\n")[3];
  return filePath;
}

function beforeEach(fn) {
  beforeEachs.push(fn);
}

function afterEach(fn) {
  afterEachs.push(fn);
}

function describe(description, fn) {
  currentDescription = { name: description, it: [] };
  fn();
  stats.push(currentDescription);
}

function it(description, fn) {
  currentIt = { name: description, expects: [] };
  totalTest++;

  for (const be of beforeEachs) {
    be.apply(this);
  }

  fn();

  for (const ae of afterEachs) {
    ae.apply(this);
  }
  currentDescription.it.push(currentIt);
}

function expect(value) {
  return {
    isNot: false,
    get not() {
      this.isNot = true;
      return this;
    },
    toBe: function toBe(expected) {
      const filePath = getFilePath();
      if (this.isNot ? value !== expected : value === expected) {
        currentIt.expects.push({
          msg: chalk.green(`expect ${value} to be ${expected}`),
          status: true,
          filePath,
        });
        passed++;
      } else {
        currentIt.expects.push({
          msg: chalk.red(`expect ${value} to be ${expected}`),
          status: false,
          filePath,
        });
        failed++;
      }
    },
    toEqual: function toEqual(expected) {
      const filePath = getFilePath();
      if (this.isNot ? value != expected : value == expected) {
        currentIt.expects.push({
          msg: chalk.green(`expect ${value} to be ${expected}`),
          status: true,
          filePath,
        });
        passed++;
      } else {
        currentIt.expects.push({
          msg: chalk.green(`expect ${value} to be ${expected}`),
          status: false,
          filePath,
        });
        failed++;
      }
    },
    toBeNull: function toBeNull(expected) {
      const filePath = getFilePath();
      if (this.isNot ? value !== null : value === null) {
        currentIt.expects.push({
          msg: chalk.green(`expect ${value} to be ${expected}`),
          status: true,
          filePath,
        });
        passed++;
      } else {
        currentIt.expects.push({
          msg: chalk.green(
            `expect ${value} to be null but got ${expected} instead`
          ),
          status: false,
          filePath,
        });

        failed++;
      }
    },
    toThrow: function toThrow() {
      const filePath = getFilePath();
      try {
        value();
        throw new Error("tiny-jest custom error");
      } catch (error) {
        if (
          this.isNot
            ? error.message !== "tiny-jest custom error"
            : error.message === "tiny-jest custom error"
        ) {
          currentIt.expects.push({
            msg: chalk.green(
              `expect ${value.name || ""} function to throw an exemption`
            ),
            status: false,
            filePath,
          });
          failed++;
        } else {
          currentIt.expects.push({
            msg: chalk.green(
              `expect ${value.name || ""} function not to throw an exemption`
            ),
            status: true,
            filePath,
          });
          passed++;
        }
      }
    },
  };
}

exports.showTestsResults = function showTestsResults() {
  for (const description of stats) {
    console.log(description.name);
    for (const it of description.it) {
      console.log(`    ${it.name}`);
      for (const expect of it.expects) {
        console.log(
          `        ${
            expect.status
              ? chalk.green(expect.msg)
              : chalk.red(expect.msg + "\n    " + expect.filePath)
          }`
        );
      }
    }
  }
  console.log("\n");
  console.log(chalk.green("[✓] Passed: ", passed));
  console.log(chalk.red("[X] Failed: ", failed));
  console.log(chalk.yellow("Total: ", totalTest));
};

global.describe = describe;
global.it = it;
global.expect = expect;
global.beforeEach = beforeEach;
global.afterEach = beforeEach;
