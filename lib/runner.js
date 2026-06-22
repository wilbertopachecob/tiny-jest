const { globSync } = require("glob");
const { runTestFile, showTestsResults } = require("./index");
const state = require("./state");

/**
 * Find all test files under the current working directory.
 * @returns {string[]}
 */
function getTestFiles() {
  return globSync("**/*.test.js", { ignore: "node_modules/**" });
}

/**
 * Discover and run all test files, then print results.
 * @returns {Promise<number>} Exit code (0 = pass, 1 = fail).
 */
async function runAllTests() {
  const files = getTestFiles();
  const accumulated = { totalTest: 0, passed: 0, failed: 0, stats: [] };

  for (const file of files) {
    const results = await runTestFile(file);
    accumulated.totalTest += results.totalTest;
    accumulated.passed += results.passed;
    accumulated.failed += results.failed;
    accumulated.stats.push(...results.stats);
  }

  state.resetState();
  state.totalTest = accumulated.totalTest;
  state.passed = accumulated.passed;
  state.failed = accumulated.failed;
  state.suites.push(...accumulated.stats);

  showTestsResults();
  return accumulated.failed > 0 ? 1 : 0;
}

module.exports = { getTestFiles, runAllTests };
