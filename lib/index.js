const fs = require("fs");
const state = require("./state");
const suite = require("./suite");
const { expect } = require("./expect");
const { runSuites } = require("./run-test");
const { showTestsResults } = require("./reporter");

/**
 * Attach describe, it, expect, and hooks to global scope.
 */
function setupGlobals() {
  global.describe = suite.describe;
  global.it = suite.it;
  global.expect = expect;
  global.beforeEach = suite.beforeEach;
  global.afterEach = suite.afterEach;
}

/**
 * Load one test file, run its suites, and return results.
 * @param {string} filePath
 * @returns {Promise<{ totalTest: number, passed: number, failed: number, stats: object[] }>}
 */
async function runTestFile(filePath) {
  state.resetState();
  setupGlobals();
  require(fs.realpathSync(filePath));
  await runSuites();
  return state.getResults();
}

module.exports = {
  resetState: state.resetState,
  setupGlobals,
  runTestFile,
  runSuites,
  showTestsResults,
  getResults: state.getResults,
};
