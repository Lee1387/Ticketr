import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../test/createTestApp.js";

describe("organization route validation", () => {
  it("rejects invalid organization identifiers", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: "/organizations/not-an-organization-id",
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: {
          code: "BAD_REQUEST",
          message: "Request validation failed.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
