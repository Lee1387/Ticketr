import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../../../service/access/organizationAccess.service.js";
import {
  organizationMemberRouteTestUserId,
  organizationRouteTestOrganization,
} from "../../organizations.routes.testUtils.js";

describe("organization member deactivation route authorization", () => {
  it("requires authentication", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRouteTestUserId}`,
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

  it("prevents agents from deactivating organization members", async () => {
    const app = createTestApp();

    try {
      const response = await deactivateMember(app);

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to deactivate organization members.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("prevents deactivation when the authenticated user is not an organization member", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: new OrganizationAccessService({
          findByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
        }),
      },
    });

    try {
      const response = await deactivateMember(app);

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

async function deactivateMember(app: ReturnType<typeof createTestApp>) {
  return app.inject({
    method: "DELETE",
    url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRouteTestUserId}`,
    headers: await createAuthHeaders(app),
  });
}
