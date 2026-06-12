import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation create route validation", () => {
  it("rejects invalid invitation creation requests", async () => {
    const app = createTestApp({
      services: {
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
        payload: JSON.stringify({
          email: "not-an-email",
          expiresAt: "not-a-date",
          role: "owner",
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
