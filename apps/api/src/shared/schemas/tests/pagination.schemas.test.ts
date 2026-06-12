import { describe, expect, it } from "vitest";

import { cursorPaginationQuerySchema } from "../pagination.schemas.js";

describe("cursor pagination schema", () => {
  it("parses bounded cursor pagination query input", () => {
    expect(
      cursorPaginationQuerySchema.parse({
        createdBefore: "2026-01-02T00:00:00.000Z",
        limit: "10",
      }),
    ).toEqual({
      createdBefore: new Date("2026-01-02T00:00:00.000Z"),
      limit: 10,
    });
  });

  it("defaults the page size", () => {
    expect(cursorPaginationQuerySchema.parse({})).toEqual({
      limit: 20,
    });
  });

  it("rejects unbounded page sizes", () => {
    expect(cursorPaginationQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
  });
});
