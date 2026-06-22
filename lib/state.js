/**
 * Shared mutable state for a single test-file run.
 * Reset between files so hooks and counters do not leak.
 */

/** @type {number} */
let totalTest = 0;

/** @type {number} */
let passed = 0;

/** @type {number} */
let failed = 0;

/** @type {Function[]} */
let beforeEachs = [];

/** @type {Function[]} */
let afterEachs = [];

/**
 * Suites registered during the require phase.
 * @type {{ name: string, tests: { name: string, fn: Function }[], it: { name: string, expects: object[], error?: string }[] }[]}
 */
const suites = [];

/** @type {{ name: string, tests: object[], it: object[] } | null} */
let currentSuite = null;

/**
 * The test currently being executed (used by matchers).
 * @type {{ name: string, expects: object[], error?: string } | null}
 */
let currentIt = null;

/**
 * Reset all state. Call once before loading each test file.
 */
function resetState() {
  totalTest = 0;
  passed = 0;
  failed = 0;
  beforeEachs = [];
  afterEachs = [];
  suites.length = 0;
  currentSuite = null;
  currentIt = null;
}

/**
 * @returns {{ totalTest: number, passed: number, failed: number, stats: typeof suites }}
 */
function getResults() {
  return { totalTest, passed, failed, stats: suites };
}

module.exports = {
  get totalTest() {
    return totalTest;
  },
  set totalTest(value) {
    totalTest = value;
  },
  get passed() {
    return passed;
  },
  set passed(value) {
    passed = value;
  },
  get failed() {
    return failed;
  },
  set failed(value) {
    failed = value;
  },
  get beforeEachs() {
    return beforeEachs;
  },
  get afterEachs() {
    return afterEachs;
  },
  suites,
  get currentSuite() {
    return currentSuite;
  },
  set currentSuite(value) {
    currentSuite = value;
  },
  get currentIt() {
    return currentIt;
  },
  set currentIt(value) {
    currentIt = value;
  },
  resetState,
  getResults,
};
