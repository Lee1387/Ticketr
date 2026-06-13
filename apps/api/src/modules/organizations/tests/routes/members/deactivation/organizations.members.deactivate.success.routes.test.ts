import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import {
  createOrganizationRouteAccessService,
  organizationMemberRouteTestUserId,
  organizationRouteTestOrganization,
} from "../../organizations.routes.testUtils.js";

describe("organization member deactivation route success", () => {
  it("deactivates an organization member", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createOrganizationRouteAccessService("owner"),
      },
    });

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRouteTestUserId}`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        member: {
          membershipStatus: "deactivated",
          organizationId: organizationRouteTestOrganization.id,
          role: "agent",
          userId: organizationMemberRouteTestUserId,
        },
      });
    } finally {
      await app.close();
    }
  });
});
