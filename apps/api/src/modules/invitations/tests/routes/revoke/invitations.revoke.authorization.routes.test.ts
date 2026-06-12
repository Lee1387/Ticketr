import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation revoke route authorization", () => {
  it("requires authentication before revoking invitations", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createRouteTestOrganizationAccessService("admin"),
      },
    });

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations/${invitationServiceTestInvitation.id}`,
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

  it("prevents agents from revoking invitations", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations/${invitationServiceTestInvitation.id}`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to revoke invitations for this organization.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
