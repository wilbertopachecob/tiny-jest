# AGENTS.md

Guidance for AI agents and contributors working on tiny-jest.

## What is tiny-jest?

A minimal, educational Jest-like test runner. Goals:

- Small enough for a junior developer to read the entire codebase
- CommonJS (no build step)
- Sync and async test support
- No config file, no watch mode, no TypeScript

## Directory map

| File | Responsibility |
|------|----------------|
| `bin/tiny_jest` | Shebang entry; requires `lib/cli.js` |
| `lib/cli.js` | Calls `runAllTests()`, exits with code 0 or 1 |
| `lib/runner.js` | Discovers test files, runs each file, accumulates results |
| `lib/index.js` | Public API: `setupGlobals()`, `runTestFile()` |
| `lib/state.js` | Mutable counters, hooks, suite queue; `resetState()` |
| `lib/suite.js` | `describe`, `it`, `beforeEach`, `afterEach` (registration only) |
| `lib/run-test.js` | `runSuites()`, `runMaybeAsync()` — async execution |
| `lib/expect.js` | Matchers: `toBe`, `toEqual`, `toBeNull`, `toThrow`, `.not` |
| `lib/reporter.js` | `showTestsResults()` console output |
| `test/*.test.js` | Example and self-test files |

## Async execution model

Tests use a **register first, run later** pattern:

1. `require(testFile)` runs synchronously. `describe`/`it` only push to `state.suites`.
2. `runSuites()` iterates suites and tests sequentially.
3. `runMaybeAsync(fn)` calls `fn()` and awaits if the return value is a Promise.
4. Rejected promises or thrown errors are caught and recorded as test failures.

Tests within a file run **one at a time** (not concurrently). This avoids race conditions on shared state.

## Commands

```bash
npm test       # run all *.test.js files
npm run lint   # ESLint
```

## Conventions

- **CommonJS** — `require` / `module.exports`
- **JSDoc** on every exported function in `lib/`
- **No new dependencies** unless clearly justified
- Keep files focused; prefer ~80 lines per module
- Match existing style: double quotes, minimal comments

## Common tasks

| Task | Where to edit |
|------|---------------|
| Add a matcher | `lib/expect.js` |
| Change test execution | `lib/run-test.js` |
| Change output format | `lib/reporter.js` |
| Change file discovery | `lib/runner.js` (`getTestFiles`) |
| Add global test API | `lib/suite.js` + `lib/index.js` `setupGlobals()` |

## Known intentional test failures

- `test/test02.test.js` — demo failure
- `test/async.test.js` — includes a rejected-promise test that always fails

These cause `npm test` to exit with code 1.
