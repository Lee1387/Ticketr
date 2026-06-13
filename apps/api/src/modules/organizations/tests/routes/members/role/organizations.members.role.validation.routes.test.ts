import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../../test/createTestApp.js";
import {
  organizationMemberRoleRouteTestUserId,
  organizationRouteTestOrganization,
} from "../../organizations.routes.testUtils.js";

describe("organization member role route validation", () => {
  it("rejects invalid member roles", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRoleRouteTestUserId}/role`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          role: "manager",
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
