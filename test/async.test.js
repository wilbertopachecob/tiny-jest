describe("async tests", () => {
  let hookValue = 0;

  beforeEach(async () => {
    hookValue = await Promise.resolve(10);
  });

  afterEach(async () => {
    await Promise.resolve();
    hookValue = 0;
  });

  it("waits for a promise", async () => {
    const value = await Promise.resolve(42);
    expect(value).toBe(42);
  });

  it("runs async beforeEach hook", async () => {
    expect(hookValue).toBe(10);
  });

  it("fails on rejected promise", async () => {
    await Promise.reject(new Error("boom"));
  });
});
