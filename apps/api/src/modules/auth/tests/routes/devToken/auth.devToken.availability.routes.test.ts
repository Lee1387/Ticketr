import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { developmentTokenRouteTestBody } from "../auth.routes.testUtils.js";

describe("development auth token route availability", () => {
  it("does not register development token route outside development", async () => {
    const app = createTestApp({ nodeEnv: "test" });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: developmentTokenRouteTestBody,
      });

      expect(response.statusCode).toBe(404);
    } finally {
      await app.close();
    }
  });
});
