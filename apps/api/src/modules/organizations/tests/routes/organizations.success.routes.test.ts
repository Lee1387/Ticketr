import { describe, expect, it } from "vitest";

import { createAuthHeaders } from "../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../test/createTestApp.js";
import {
  organizationRouteTestOrganization,
  organizationRouteTestResponse,
} from "./organizations.routes.testUtils.js";

describe("organization route success", () => {
  it("returns an organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationRouteTestOrganization.id}`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        organization: organizationRouteTestResponse,
      });
    } finally {
      await app.close();
    }
  });
});
