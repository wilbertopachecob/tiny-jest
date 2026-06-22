const chalk = require("chalk").default;
const state = require("./state");

/**
 * Print the test tree and summary counts to stdout.
 */
function showTestsResults() {
  for (const description of state.suites) {
    console.log(description.name);
    for (const test of description.it) {
      console.log(`    ${test.name}`);
      if (test.error) {
        console.log(chalk.red(`        ${test.error}`));
      }
      for (const assertion of test.expects) {
        console.log(
          `        ${
            assertion.status
              ? chalk.green(assertion.msg)
              : chalk.red(assertion.msg + "\n    " + assertion.filePath)
          }`
        );
      }
    }
  }
  console.log("\n");
  console.log(chalk.green("[✓] Passed: ", state.passed));
  console.log(chalk.red("[X] Failed: ", state.failed));
  console.log(chalk.yellow("Total: ", state.totalTest));
}

module.exports = { showTestsResults };
