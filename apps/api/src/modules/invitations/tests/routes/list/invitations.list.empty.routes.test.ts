import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation list route empty state", () => {
  it("returns an empty list when the organization has no invitations", async () => {
    const app = createTestApp({
      services: {
        invitationsService: createServiceTestInvitationsService({
          invitationsRepository: createServiceTestInvitationsRepository({
            listPendingByOrganizationId: () => Promise.resolve([]),
          }),
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

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        invitations: [],
      });
    } finally {
      await app.close();
    }
  });
});
