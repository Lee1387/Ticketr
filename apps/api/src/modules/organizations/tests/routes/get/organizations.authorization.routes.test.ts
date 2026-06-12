import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../../service/organizationAccess.service.js";
import { organizationRouteTestOrganization } from "../organizations.routes.testUtils.js";

describe("organization route authorization", () => {
  it("requires authentication", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationRouteTestOrganization.id}`,
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("prevents access to another organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: "/organizations/de4d1aba-8c93-4a2a-9844-856e5976da48",
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to this organization.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("prevents access when the authenticated user is not an organization member", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: new OrganizationAccessService({
          findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationRouteTestOrganization.id}`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to this organization.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
