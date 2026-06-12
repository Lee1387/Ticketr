import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createOrganizationRouteAccessService,
  organizationMemberRoleRouteTestUserId,
  organizationRouteTestOrganization,
} from "../organizations.routes.testUtils.js";

describe("organization member role route success", () => {
  it("updates an organization member role", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createOrganizationRouteAccessService("owner"),
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

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        member: {
          organizationId: organizationRouteTestOrganization.id,
          role: "admin",
          userId: organizationMemberRoleRouteTestUserId,
        },
      });
    } finally {
      await app.close();
    }
  });
});
