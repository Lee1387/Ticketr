import { describe, expect, it } from "vitest";

import { createAuthHeaders, defaultTestAuthPayload } from "../../../test/authTestUtils.js";
import { createTestApp } from "../../../test/createTestApp.js";
import { registerAuthContextTestRoute } from "./jwtAuthPlugin.testUtils.js";

describe("JWT auth plugin auth context", () => {
  it("sets auth context from a valid bearer token", async () => {
    const app = createTestApp();

    try {
      registerAuthContextTestRoute(app);

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        auth: defaultTestAuthPayload,
      });
    } finally {
      await app.close();
    }
  });

  it("leaves auth context empty when a bearer token is missing", async () => {
    const app = createTestApp();

    try {
      registerAuthContextTestRoute(app);

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        auth: null,
      });
    } finally {
      await app.close();
    }
  });
});
