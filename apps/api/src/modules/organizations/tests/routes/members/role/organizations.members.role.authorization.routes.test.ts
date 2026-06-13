import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../../../service/access/organizationAccess.service.js";
import {
  organizationMemberRoleRouteTestUserId,
  organizationRouteTestOrganization,
} from "../../organizations.routes.testUtils.js";

describe("organization member role route authorization", () => {
  it("requires authentication", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRoleRouteTestUserId}/role`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          role: "admin",
        }),
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

  it("prevents agents from managing member roles", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRoleRouteTestUserId}/role`,
        headers: {
          "content-type": "application/json",
          ...(await createAuthHeaders(app)),
        },
        payload: JSON.stringify({
          role: "admin",
        }),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to manage organization member roles.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("prevents role management when the authenticated user is not an organization member", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: new OrganizationAccessService({
          findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRoleRouteTestUserId}/role`,
        headers: {
          "content-type": "application/json",
          ...(await createAuthHeaders(app)),
        },
        payload: JSON.stringify({
          role: "admin",
        }),
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
