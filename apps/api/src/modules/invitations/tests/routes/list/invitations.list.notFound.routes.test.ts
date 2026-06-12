import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { missingInvitationOrganizationLookup } from "../../helpers/invitations.service.lookups.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation list route not found handling", () => {
  it("maps missing organizations", async () => {
    const app = createTestApp({
      services: {
        invitationsService: createServiceTestInvitationsService({
          organizationLookup: missingInvitationOrganizationLookup,
        }),
        organizationAccessService: createRouteTestOrganizationAccessService("admin"),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Organization was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
