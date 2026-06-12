import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { invalidTokenResponse, registerProtectedTestRoute } from "./jwtAuthPlugin.testUtils.js";

describe("JWT auth plugin malformed token validation", () => {
  it("rejects invalid bearer tokens", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: "Bearer not-a-token",
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });
});
