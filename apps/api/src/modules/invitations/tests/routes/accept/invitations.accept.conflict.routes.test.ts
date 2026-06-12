import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { invitationEmailMismatchMessage } from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestUserId,
} from "../../helpers/invitations.service.fixtures.js";

describe("invitation accept route conflicts", () => {
  it("maps invitation acceptance conflicts", async () => {
    const invitationsService = createServiceTestInvitationsService({
      userLookup: {
        findById: () =>
          Promise.resolve({
            email: "other@example.com",
            id: invitationServiceTestUserId,
            status: "active",
          }),
      },
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

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        error: {
          code: "CONFLICT",
          message: invitationEmailMismatchMessage,
        },
      });
    } finally {
      await app.close();
    }
  });
});
