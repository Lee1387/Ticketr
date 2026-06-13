import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../../../organizations/service/access/organizationAccess.service.js";
import { createActiveAuthService, loginRouteTestBody } from "../auth.routes.testUtils.js";

describe("auth login route rejections", () => {
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
});
