import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation list route success", () => {
  it("lists invitations for organization admins", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createRouteTestOrganizationAccessService("admin"),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations?limit=10&createdBefore=2026-01-02T00%3A00%3A00.000Z`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        invitations: [
          {
            acceptedAt: null,
            createdAt: "2026-01-01T00:00:00.000Z",
            email: "agent@example.com",
            expiresAt: "2026-01-08T00:00:00.000Z",
            id: invitationServiceTestInvitation.id,
            organizationId: invitationRouteTestOrganizationId,
            role: "agent",
            status: "pending",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      });
    } finally {
      await app.close();
    }
  });
});
