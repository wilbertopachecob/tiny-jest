const state = require("./state");

/**
 * Register a hook to run before each test in the current file.
 * @param {Function} fn - Hook function (may be async).
 */
function beforeEach(fn) {
  state.beforeEachs.push(fn);
}

/**
 * Register a hook to run after each test in the current file.
 * @param {Function} fn - Hook function (may be async).
 */
function afterEach(fn) {
  state.afterEachs.push(fn);
}

/**
 * Group related tests under a description.
 * Tests are registered here and run later by runSuites().
 * @param {string} description - Suite name shown in output.
 * @param {Function} fn - Callback that registers tests via it().
 */
function describe(description, fn) {
  state.currentSuite = { name: description, tests: [], it: [] };
  fn();
  state.suites.push(state.currentSuite);
  state.currentSuite = null;
}

/**
 * Register a single test. The body does not run until runSuites().
 * @param {string} description - Test name shown in output.
 * @param {Function} fn - Test function (may be async).
 */
function it(description, fn) {
  if (!state.currentSuite) {
    throw new Error(`it("${description}") must be called inside describe()`);
  }
  state.currentSuite.tests.push({ name: description, fn });
}

module.exports = { describe, it, beforeEach, afterEach };
