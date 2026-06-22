const chalk = require("chalk");
const state = require("./state");

/**
 * Parse the call stack to find the test file line for failure output.
 * @returns {string | undefined}
 */
function getFilePath() {
  return new Error().stack?.split("\n")[3];
}

/**
 * Record a passing assertion on the current test.
 * @param {string} msg
 */
function recordPass(msg) {
  state.currentIt.expects.push({
    msg: chalk.green(msg),
    status: true,
    filePath: getFilePath(),
  });
  state.passed++;
}

/**
 * Record a failing assertion on the current test.
 * @param {string} msg
 */
function recordFail(msg) {
  state.currentIt.expects.push({
    msg: chalk.red(msg),
    status: false,
    filePath: getFilePath(),
  });
  state.failed++;
}

/**
 * Create a matcher object for the given value.
 * @param {*} value - Actual value under test.
 * @returns {object} Matcher with toBe, toEqual, toBeNull, toThrow, and .not.
 */
function expect(value) {
  return {
    isNot: false,
    get not() {
      this.isNot = true;
      return this;
    },

    /**
     * Strict equality (===).
     * @param {*} expected
     */
    toBe(expected) {
      const pass = this.isNot ? value !== expected : value === expected;
      const msg = `expect ${value} to be ${expected}`;
      if (pass) recordPass(msg);
      else recordFail(msg);
    },

    /**
     * Loose equality (==).
     * @param {*} expected
     */
    toEqual(expected) {
      const pass = this.isNot ? value != expected : value == expected;
      const msg = `expect ${value} to equal ${expected}`;
      if (pass) recordPass(msg);
      else recordFail(msg);
    },

    /**
     * Check that value is (or is not) null.
     */
    toBeNull() {
      const pass = this.isNot ? value !== null : value === null;
      if (pass) {
        recordPass(`expect ${value} to be null`);
      } else {
        recordFail(`expect ${value} to be null but got ${value} instead`);
      }
    },

    /**
     * Check that a function throws (or does not throw).
     */
    toThrow() {
      const fnName = value.name || "anonymous";
      let threw = false;

      try {
        value();
      } catch {
        threw = true;
      }

      const shouldThrow = !this.isNot;
      const pass = shouldThrow ? threw : !threw;

      if (pass) {
        recordPass(
          shouldThrow
            ? `expect ${fnName} function to throw`
            : `expect ${fnName} function not to throw`
        );
      } else {
        recordFail(
          shouldThrow
            ? `expect ${fnName} function to throw`
            : `expect ${fnName} function not to throw`
        );
      }
    },
  };
}

module.exports = { expect };
