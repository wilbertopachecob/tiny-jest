const state = require("./state");

/**
 * Run a function and await it when it returns a Promise.
 * @param {Function} fn
 * @returns {Promise<void>}
 */
async function runMaybeAsync(fn) {
  const result = fn();
  if (result instanceof Promise) {
    await result;
  }
}

/**
 * Run hooks, test body, and record results for one test.
 * @param {{ name: string, tests: object[], it: object[] }} suite
 * @param {{ name: string, fn: Function }} test
 */
async function runSingleTest(suite, test) {
  state.currentIt = { name: test.name, expects: [] };
  state.totalTest++;

  try {
    for (const hook of state.beforeEachs) {
      await runMaybeAsync(hook);
    }

    await runMaybeAsync(test.fn);

    for (const hook of state.afterEachs) {
      await runMaybeAsync(hook);
    }
  } catch (error) {
    state.currentIt.error = error.message || String(error);
    state.failed++;
  }

  suite.it.push(state.currentIt);
  state.currentIt = null;
}

/**
 * Run all registered suites and tests sequentially.
 * @returns {Promise<void>}
 */
async function runSuites() {
  for (const suite of state.suites) {
    for (const test of suite.tests) {
      await runSingleTest(suite, test);
    }
  }
}

module.exports = { runMaybeAsync, runSingleTest, runSuites };
