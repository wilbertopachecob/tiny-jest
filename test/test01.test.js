describe("test01", () => {
  beforeEach(() => {
    // console.log("BeforeEach");
  });

  it("expected to succeed using not", () => {
    expect(1 === 1).not.toBe(false);
  });

  it("expected to succeed", () => {
    expect(1 === 1).toBe(true);
  });

  it("throws an error", () => {
    expect(function myCustomError() {
      throw new Error("test");
    }).toThrow();
  });

  it("not throws an error", () => {
    expect(() => {}).not.toThrow();
  });
});
