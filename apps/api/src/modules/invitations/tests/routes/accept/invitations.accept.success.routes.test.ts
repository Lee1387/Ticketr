import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestUserId,
} from "../../helpers/invitations.service.fixtures.js";
import { invitationRouteTestAcceptedAt } from "../invitations.routes.testUtils.js";

describe("invitation accept route success", () => {
  it("accepts an invitation for the authenticated invited user", async () => {
    const app = createTestApp({
      services: {
        invitationsService: createServiceTestInvitationsService({
          now: () => invitationRouteTestAcceptedAt,
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: `/invitations/${invitationServiceTestInvitation.id}/accept`,
        headers: await createAuthHeaders(app, {
          userId: invitationServiceTestUserId,
        }),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        invitation: {
          acceptedAt: "2026-01-02T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          email: "agent@example.com",
          expiresAt: "2026-01-08T00:00:00.000Z",
          id: invitationServiceTestInvitation.id,
          organizationId: invitationServiceTestInvitation.organizationId,
          role: "agent",
          status: "accepted",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      });
    } finally {
      await app.close();
    }
  });
});
