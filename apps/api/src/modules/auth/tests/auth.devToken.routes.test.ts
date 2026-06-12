import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../organizations/organizationAccess.service.js";
import { AuthService } from "../auth.service.js";
import { developmentTokenRouteTestBody, tokenResponseSchema } from "./auth.routes.testUtils.js";

describe("development auth token route", () => {
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

  it("rejects development tokens for inactive users", async () => {
    const app = createTestApp({
      nodeEnv: "development",
      services: {
        authService: new AuthService({
          findByEmail: vi.fn(() => Promise.resolve(null)),
          findById: vi.fn(() => Promise.resolve({ status: "suspended" as const })),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: developmentTokenRouteTestBody,
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Development token user is invalid.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects development tokens for organization non-members", async () => {
    const app = createTestApp({
      nodeEnv: "development",
      services: {
        organizationAccessService: new OrganizationAccessService({
          findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: developmentTokenRouteTestBody,
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "Development token user is not an organization member.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
