# tiny-jest

A minimal Jest-like test runner built for learning. It supports synchronous and async tests with a small, readable codebase.

## Quick start

```bash
npm install
npm test
```

Tests are discovered automatically from `**/*.test.js` (excluding `node_modules`).

## Writing tests

Create a file ending in `.test.js`:

```js
describe("math", () => {
  it("adds numbers", () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Async tests

Test functions and hooks can be `async`. The runner waits for Promises to settle before moving on:

```js
describe("async example", () => {
  beforeEach(async () => {
    await setupDatabase();
  });

  it("fetches data", async () => {
    const result = await fetchData();
    expect(result).toBe(42);
  });
});
```

If a test throws or rejects, it is marked as failed with the error message.

## API

| Function | Description |
|----------|-------------|
| `describe(name, fn)` | Group tests under a name |
| `it(name, fn)` | Define a test (sync or async) |
| `beforeEach(fn)` | Run before each test (sync or async) |
| `afterEach(fn)` | Run after each test (sync or async) |
| `expect(value)` | Start an assertion |
| `Any` | Wildcard type matcher for `toContainObject` |

### Matchers

| Matcher | Description |
|---------|-------------|
| `.toBe(expected)` | Strict equality (`===`) |
| `.toEqual(expected)` | Loose equality (`==`) |
| `.toBeNull()` | Value is `null` |
| `.toThrow()` | Function throws an error |
| `.toContainObject(expected)` | Received object contains a subset of keys/values |
| `.not` | Negate the next matcher (e.g. `expect(x).not.toBe(y)`) |

#### `toContainObject`

Checks that the received object includes at least the keys in `expected`, with matching values. Extra keys on the received object are allowed.

```js
expect({ id: 1, name: "Alice", extra: true }).toContainObject({ id: 1, name: "Alice" });
```

Use built-in constructors as type matchers instead of literal values:

```js
expect({ id: 1, name: "Alice" }).toContainObject({ id: Number, name: String });
```

Use `Any` to match any value for a key:

```js
expect({ id: 1, name: "Alice" }).toContainObject({ id: Any, name: Any });
```

Nested objects are matched recursively. Supported type matchers include `Number`, `String`, `Boolean`, `BigInt`, `Symbol`, `Function`, `Object`, `Array`, `Date`, `RegExp`, `Map`, and `Set`.

## Project structure

```
bin/tiny_jest       CLI entry point
lib/
  state.js          Counters, hooks, and test queue
  suite.js          describe, it, beforeEach, afterEach
  run-test.js       Async-aware test execution
  expect.js         Matchers
  reporter.js       Console output
  runner.js         File discovery and orchestration
  index.js          Public API
  cli.js            CLI logic
test/               Example test files
```

## How it works

1. **Registration** — When a test file is `require()`d, `describe` and `it` collect tests into a queue. No test bodies run yet.
2. **Execution** — After registration, `runSuites()` runs each test one at a time, awaiting async hooks and test functions.
3. **Reporting** — Results print to the console. The process exits with code `1` if any test failed.

See JSDoc comments in `lib/` for function-level documentation.

## Development

```bash
npm test    # run all tests
npm run lint
```

## License

MIT
