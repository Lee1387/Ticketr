import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation revoke route not found handling", () => {
  it("maps missing pending invitations", async () => {
    const invitationsService = createServiceTestInvitationsService({
      invitationsRepository: createServiceTestInvitationsRepository({
        revokePendingById: () => Promise.resolve(null),
      }),
    });
    const app = createTestApp({
      services: {
        invitationsService,
        organizationAccessService: createRouteTestOrganizationAccessService("admin"),
      },
    });

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations/${invitationServiceTestInvitation.id}`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Invitation was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
