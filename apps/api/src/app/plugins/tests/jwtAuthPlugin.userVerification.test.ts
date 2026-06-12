import { describe, expect, it } from "vitest";

import { AuthService } from "../../../modules/auth/auth.service.js";
import { createAuthHeaders } from "../../../test/authTestUtils.js";
import { createTestApp } from "../../../test/createTestApp.js";
import { invalidTokenResponse, registerProtectedTestRoute } from "./jwtAuthPlugin.testUtils.js";

describe("JWT auth plugin user verification", () => {
  it("rejects bearer tokens for missing users", async () => {
    const app = createTestApp({
      services: {
        authService: new AuthService({
          findById: () => Promise.resolve(null),
        }),
      },
    });

    try {
      registerProtectedTestRoute(app);

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });

  it("rejects bearer tokens for suspended users", async () => {
    const app = createTestApp({
      services: {
        authService: new AuthService({
          findById: () => Promise.resolve({ status: "suspended" as const }),
        }),
      },
    });

    try {
      registerProtectedTestRoute(app);

      const response = await app.inject({
        method: "GET",
        url: "/auth-context-test",
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual(invalidTokenResponse);
    } finally {
      await app.close();
    }
  });
});
