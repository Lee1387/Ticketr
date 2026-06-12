import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../../../organizations/service/organizationAccess.service.js";
import { AuthService } from "../../../service/auth.service.js";
import { developmentTokenRouteTestBody } from "../auth.routes.testUtils.js";

describe("development auth token route rejections", () => {
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
