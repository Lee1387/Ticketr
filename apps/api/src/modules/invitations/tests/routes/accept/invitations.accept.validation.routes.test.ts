import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { invitationServiceTestUserId } from "../../helpers/invitations.service.fixtures.js";

describe("invitation accept route validation", () => {
  it("rejects invalid invitation identifiers", async () => {
    const app = createTestApp({
      services: {
        invitationsService: createServiceTestInvitationsService(),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/invitations/not-an-id/accept",
        headers: await createAuthHeaders(app, {
          userId: invitationServiceTestUserId,
        }),
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: {
          code: "BAD_REQUEST",
          message: "Request validation failed.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
