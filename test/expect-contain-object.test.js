describe("toContainObject", () => {
  it("matches literal values", () => {
    expect({ id: 1, name: "Alice" }).toContainObject({ id: 1, name: "Alice" });
  });

  it("matches primitive type matchers", () => {
    expect({
      num: 42,
      str: "hi",
      bool: true,
      big: 10n,
      sym: Symbol("x"),
    }).toContainObject({
      num: Number,
      str: String,
      bool: Boolean,
      big: BigInt,
      sym: Symbol,
    });
  });

  it("matches Any for any value", () => {
    expect({ id: 1, name: "Alice" }).toContainObject({ id: Any, name: Any });
  });

  it("matches nested object subsets", () => {
    expect({ meta: { count: 3, label: "items" } }).toContainObject({
      meta: { count: Number },
    });
  });

  it("matches null and undefined literals", () => {
    expect({ a: null, b: undefined }).toContainObject({
      a: null,
      b: undefined,
    });
  });

  it("allows extra keys on received object", () => {
    expect({ id: 1, extra: true }).toContainObject({ id: Number });
  });

  it("fails when key is missing", () => {
    expect({ id: 1 }).not.toContainObject({ id: Number, name: String });
  });

  it("fails when type does not match", () => {
    expect({ id: "1" }).not.toContainObject({ id: Number });
  });

  it("fails when literal does not match", () => {
    expect({ id: 2 }).not.toContainObject({ id: 1 });
  });

  it("fails for non-object received value", () => {
    expect(5).not.toContainObject({ id: Number });
    expect(null).not.toContainObject({ id: Number });
    expect([]).not.toContainObject({ id: Number });
  });

  it("matches built-in object types", () => {
    expect({
      arr: [1, 2],
      date: new Date("2020-01-01"),
      re: /abc/,
      map: new Map(),
      set: new Set(),
    }).toContainObject({
      arr: Array,
      date: Date,
      re: RegExp,
      map: Map,
      set: Set,
    });
  });
});
