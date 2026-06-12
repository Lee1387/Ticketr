import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../organizations/organizationAccess.service.js";
import { AuthService } from "../auth.service.js";
import {
  authRouteTestUserId,
  loginRouteTestBody,
  tokenResponseSchema,
} from "./auth.routes.testUtils.js";

describe("auth login route", () => {
  function createActiveAuthService(passwordMatches: boolean): AuthService {
    return new AuthService(
      {
        findByEmail: vi.fn(() =>
          Promise.resolve({
            id: authRouteTestUserId,
            passwordHash: "stored-password-hash",
            status: "active" as const,
          }),
        ),
        findById: vi.fn(() => Promise.resolve({ status: "active" as const })),
      },
      vi.fn(() => Promise.resolve(passwordMatches)),
    );
  }

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

  it("rejects invalid login input", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: {
          ...loginRouteTestBody,
          email: "not-an-email",
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

  it("rejects invalid login credentials", async () => {
    const app = createTestApp({
      services: {
        authService: createActiveAuthService(false),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: loginRouteTestBody,
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid email, password, or organization.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects login when the user is not an organization member", async () => {
    const app = createTestApp({
      services: {
        authService: createActiveAuthService(true),
        organizationAccessService: new OrganizationAccessService({
          findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: loginRouteTestBody,
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid email, password, or organization.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rate limits repeated login attempts", async () => {
    const app = createTestApp({
      services: {
        authService: createActiveAuthService(false),
      },
    });

    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const response = await app.inject({
          method: "POST",
          url: "/auth/login",
          body: loginRouteTestBody,
        });

        expect(response.statusCode).toBe(401);
      }

      const rateLimitedResponse = await app.inject({
        method: "POST",
        url: "/auth/login",
        body: loginRouteTestBody,
      });

      expect(rateLimitedResponse.statusCode).toBe(429);
      expect(rateLimitedResponse.json()).toMatchObject({
        error: {
          code: "TOO_MANY_REQUESTS",
        },
      });
    } finally {
      await app.close();
    }
  });
});
