import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import { organizationRouteTestOrganization } from "../../organizations.routes.testUtils.js";

describe("organization member deactivation route validation", () => {
  it("rejects invalid member identifiers", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "DELETE",
        url: `/organizations/${organizationRouteTestOrganization.id}/members/not-a-user-id`,
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
