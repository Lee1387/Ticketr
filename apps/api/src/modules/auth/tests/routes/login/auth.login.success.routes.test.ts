import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createActiveAuthService,
  loginRouteTestBody,
  tokenResponseSchema,
} from "../auth.routes.testUtils.js";

describe("auth login route success", () => {
  it("issues an access token for valid credentials and organization membership", async () => {
    const app = createTestApp({
      services: {
        authService: createActiveAuthService(true),
      },
    });

    try {
      const tokenResponse = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: loginRouteTestBody,
      });

      expect(tokenResponse.statusCode).toBe(200);
      const tokenResponseBody: unknown = tokenResponse.json();
      const parsedTokenResponse = tokenResponseSchema.parse(tokenResponseBody);
      expect(parsedTokenResponse.tokenType).toBe("Bearer");

      const protectedResponse = await app.inject({
        method: "GET",
        url: `/organizations/${loginRouteTestBody.organizationId}`,
        headers: {
          authorization: `Bearer ${parsedTokenResponse.accessToken}`,
        },
      });

      expect(protectedResponse.statusCode).toBe(200);
    } finally {
      await app.close();
    }
  });
});
