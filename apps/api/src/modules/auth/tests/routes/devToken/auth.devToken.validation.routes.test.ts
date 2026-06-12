import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { developmentTokenRouteTestBody } from "../auth.routes.testUtils.js";

describe("development auth token route validation", () => {
  it("rejects invalid development token input", async () => {
    const app = createTestApp({ nodeEnv: "development" });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: {
          ...developmentTokenRouteTestBody,
          userId: "not-a-user-id",
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
