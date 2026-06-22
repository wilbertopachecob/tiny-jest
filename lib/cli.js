const { runAllTests } = require("./runner");

/**
 * CLI entry: run all tests and exit with the appropriate code.
 */
async function main() {
  const exitCode = await runAllTests();
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
