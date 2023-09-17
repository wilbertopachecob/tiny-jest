const { globSync } = require("glob");
const fs = require("fs");
const { showTestsResults } = require("#lib");

// all js files, but don't look in node_modules
function getTestFiles() {
  const jsfiles = globSync("**/*.test.js", { ignore: "node_modules/**" });
  return jsfiles;
}

function run() {
  const files = getTestFiles();
  files.forEach((file) => {
    require(fs.realpathSync(file));
  });
  showTestsResults();
}

run();
