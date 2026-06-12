import { describe, expect, it } from "vitest";

import { defaultTestAuthPayload, signTestAuthToken } from "../../../test/authTestUtils.js";
import { createTestApp } from "../../../test/createTestApp.js";
import { invalidTokenResponse, registerProtectedTestRoute } from "./jwtAuthPlugin.testUtils.js";

describe("JWT auth plugin auth claim validation", () => {
  it("rejects bearer tokens with invalid auth claims", async () => {
    const app = createTestApp();

    try {
      registerProtectedTestRoute(app);

      const token = await signTestAuthToken(app, {
        ...defaultTestAuthPayload,
        userId: "not-a-user-id",
      });

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });
});
