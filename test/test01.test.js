beforeEach(() => {
  console.log("BeforeEach");
});

it("expected to succeed using not", () => {
  expect(1 === 1).not.toBe(false);
});

it("expected to succeed", () => {
  expect(1 === 1).toBe(true);
});
