import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";

describe("invitation accept route authorization", () => {
  it("requires authentication before accepting invitations", async () => {
    const app = createTestApp({
      services: {
        invitationsService: createServiceTestInvitationsService(),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: `/invitations/${invitationServiceTestInvitation.id}/accept`,
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
});
