import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { developmentTokenRouteTestBody, tokenResponseSchema } from "../auth.routes.testUtils.js";

describe("development auth token route success", () => {
  it("issues a development access token for an active organization member", async () => {
    const app = createTestApp({ nodeEnv: "development" });

    try {
      const tokenResponse = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: developmentTokenRouteTestBody,
      });

      expect(tokenResponse.statusCode).toBe(200);
      const tokenResponseBody: unknown = tokenResponse.json();
      const parsedTokenResponse = tokenResponseSchema.parse(tokenResponseBody);
      expect(parsedTokenResponse.tokenType).toBe("Bearer");

      const protectedResponse = await app.inject({
        method: "GET",
        url: `/organizations/${developmentTokenRouteTestBody.organizationId}`,
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
