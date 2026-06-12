import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation revoke route validation", () => {
  it("rejects invalid invitation identifiers", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createRouteTestOrganizationAccessService("admin"),
      },
    });

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${invitationRouteTestOrganizationId}/invitations/not-an-id`,
        headers: await createAuthHeaders(app),
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
