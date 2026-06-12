import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { loginRouteTestBody } from "../auth.routes.testUtils.js";

describe("auth login route validation", () => {
  it("rejects invalid login input", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: {
          ...loginRouteTestBody,
          email: "not-an-email",
        },
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
