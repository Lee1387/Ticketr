import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestOrganizationAccessService,
  invitationRouteTestBody,
  invitationRouteTestOrganizationId,
} from "../invitations.routes.testUtils.js";

describe("invitation create route authorization", () => {
  it("requires authentication before creating invitations", async () => {
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
        },
        payload: JSON.stringify(invitationRouteTestBody),
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

  it("prevents agents from creating invitations", async () => {
    const app = createTestApp();

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

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to create invitations for this organization.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
