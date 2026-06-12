import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { AuthService } from "../auth.service.js";
import { OrganizationAccessService } from "../../organizations/organizationAccess.service.js";
import { createTestApp } from "../../../test/createTestApp.js";

const developmentTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal("Bearer"),
});

describe("auth routes", () => {
  const developmentTokenBody = {
    organizationId: "6b4df69e-0950-4209-b79a-a5b5d251540f",
    userId: "11111111-1111-4111-8111-111111111111",
  };

  it("issues a development access token for an active organization member", async () => {
    const app = createTestApp({ nodeEnv: "development" });

    try {
      const tokenResponse = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: developmentTokenBody,
      });

      expect(tokenResponse.statusCode).toBe(200);
      const tokenResponseBody: unknown = tokenResponse.json();
      const parsedTokenResponse = developmentTokenResponseSchema.parse(tokenResponseBody);
      expect(parsedTokenResponse.tokenType).toBe("Bearer");

      const protectedResponse = await app.inject({
        method: "GET",
        url: `/organizations/${developmentTokenBody.organizationId}`,
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
        body: developmentTokenBody,
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
          ...developmentTokenBody,
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
          findById: vi.fn(() => Promise.resolve({ status: "suspended" as const })),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/dev-token",
        body: developmentTokenBody,
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
        body: developmentTokenBody,
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
