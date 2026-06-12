import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { createActiveAuthService, loginRouteTestBody } from "../auth.routes.testUtils.js";

describe("auth login route rate limit", () => {
  it("rate limits repeated login attempts", async () => {
    const app = createTestApp({
      services: {
        authService: createActiveAuthService(false),
      },
    });

    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const response = await app.inject({
          method: "POST",
          url: "/auth/login",
          body: loginRouteTestBody,
        });

        expect(response.statusCode).toBe(401);
      }

      const rateLimitedResponse = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: loginRouteTestBody,
      });

      expect(rateLimitedResponse.statusCode).toBe(429);
      expect(rateLimitedResponse.json()).toMatchObject({
        error: {
          code: "TOO_MANY_REQUESTS",
        },
      });
    } finally {
      await app.close();
    }
  });
});
