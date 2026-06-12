import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { invitationAlreadyPendingMessage } from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestBody,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation create route conflicts", () => {
  it("maps duplicate invitation conflicts", async () => {
    const invitationsService = createServiceTestInvitationsService({
      invitationsRepository: createServiceTestInvitationsRepository({
        findPendingByOrganizationIdAndEmail: () => Promise.resolve(invitationServiceTestInvitation),
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
        method: "POST",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations`,
        headers: {
          "content-type": "application/json",
          ...(await createAuthHeaders(app)),
        },
        payload: JSON.stringify(invitationRouteTestBody),
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        error: {
          code: "CONFLICT",
          message: invitationAlreadyPendingMessage,
        },
      });
    } finally {
      await app.close();
    }
  });
});
