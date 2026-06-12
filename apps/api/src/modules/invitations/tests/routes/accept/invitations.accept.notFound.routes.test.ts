import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestUserId,
} from "../../helpers/invitations.service.fixtures.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";

describe("invitation accept route not found handling", () => {
  it("maps missing invitations", async () => {
    const invitationsService = createServiceTestInvitationsService({
      invitationsRepository: createServiceTestInvitationsRepository({
        findPendingById: () => Promise.resolve(null),
      }),
    });
    const app = createTestApp({
      services: {
        invitationsService,
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
