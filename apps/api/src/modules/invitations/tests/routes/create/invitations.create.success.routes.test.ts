import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestBody,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation create route success", () => {
  it("creates an invitation for organization admins", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createRouteTestOrganizationAccessService("admin"),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations`,
        headers: {
          "content-type": "application/json",
          ...(await createAuthHeaders(app)),
        },
        payload: JSON.stringify(invitationRouteTestBody),
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({
        invitation: {
          acceptedAt: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          email: "agent@example.com",
          expiresAt: "2026-01-08T00:00:00.000Z",
          id: "22222222-2222-4222-8222-222222222222",
          organizationId: invitationRouteTestOrganizationId,
          role: "agent",
          status: "pending",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      });
    } finally {
      await app.close();
    }
  });
});
