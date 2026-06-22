const chalk = require("chalk");
const state = require("./state");

/** Sentinel for matching any value in toContainObject. */
const Any = Symbol("Any");

const TYPE_MATCHERS = new Set([
  Number,
  String,
  Boolean,
  BigInt,
  Symbol,
  Function,
  Object,
  Array,
  Date,
  RegExp,
  Map,
  Set,
  WeakMap,
  WeakSet,
]);

/**
 * @param {*} value
 * @returns {boolean}
 */
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isTypeMatcher(value) {
  return value === Any || TYPE_MATCHERS.has(value);
}

/**
 * @param {*} actual
 * @param {*} matcher
 * @returns {boolean}
 */
function matchType(actual, matcher) {
  if (matcher === Any) return true;
  if (matcher === Number) {
    return typeof actual === "number" || actual instanceof Number;
  }
  if (matcher === String) {
    return typeof actual === "string" || actual instanceof String;
  }
  if (matcher === Boolean) {
    return typeof actual === "boolean" || actual instanceof Boolean;
  }
  if (matcher === BigInt) return typeof actual === "bigint";
  if (matcher === Symbol) return typeof actual === "symbol";
  if (matcher === Function) return typeof actual === "function";
  if (matcher === Object) return typeof actual === "object" && actual !== null;
  if (matcher === Array) return Array.isArray(actual);
  if (matcher === Date) return actual instanceof Date;
  if (matcher === RegExp) return actual instanceof RegExp;
  if (matcher === Map) return actual instanceof Map;
  if (matcher === Set) return actual instanceof Set;
  if (matcher === WeakMap) return actual instanceof WeakMap;
  if (matcher === WeakSet) return actual instanceof WeakSet;
  return false;
}

/**
 * Subset object match: every key in expected must exist on received with matching value or type.
 * @param {*} received
 * @param {*} expected
 * @returns {boolean}
 */
function matchesPartialObject(received, expected) {
  if (!isPlainObject(received) || !isPlainObject(expected)) {
    return false;
  }

  for (const key of Object.keys(expected)) {
    if (!Object.prototype.hasOwnProperty.call(received, key)) {
      return false;
    }

    const expVal = expected[key];
    const recVal = received[key];

    if (isTypeMatcher(expVal)) {
      if (!matchType(recVal, expVal)) return false;
    } else if (isPlainObject(expVal)) {
      if (!matchesPartialObject(recVal, expVal)) return false;
    } else if (expVal !== recVal) {
      return false;
    }
  }

  return true;
}

/**
 * Safe string for assertion messages (BigInt, Symbol, type matchers).
 * @param {*} value
 * @returns {string}
 */
function formatForMessage(value) {
  return JSON.stringify(value, (_, v) => {
    if (typeof v === "bigint") return `${v}n`;
    if (typeof v === "function") return v.name ? `[${v.name}]` : "[Function]";
    if (typeof v === "symbol") {
      if (v === Any) return "Any";
      return v.toString();
    }
    return v;
  });
}

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
 * @returns {object} Matcher with toBe, toEqual, toBeNull, toThrow, toContainObject, and .not.
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

    /**
     * Subset object match: expected keys must exist with matching literals or types.
     * @param {object} expected
     */
    toContainObject(expected) {
      const matched = matchesPartialObject(value, expected);
      const pass = this.isNot ? !matched : matched;
      const msg = `expect ${formatForMessage(value)} to contain object ${formatForMessage(expected)}`;
      if (pass) recordPass(msg);
      else recordFail(msg);
    },
  };
}

module.exports = { expect, Any };
