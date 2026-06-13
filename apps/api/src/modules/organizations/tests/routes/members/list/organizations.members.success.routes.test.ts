import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import {
  organizationMemberRouteTestResponse,
  organizationRouteTestOrganization,
} from "../../organizations.routes.testUtils.js";

describe("organization members route success", () => {
  it("returns organization members", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationRouteTestOrganization.id}/members?limit=10&createdBefore=2026-01-02T00:00:00.000Z`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        members: [organizationMemberRouteTestResponse],
      });
    } finally {
      await app.close();
    }
  });
});
