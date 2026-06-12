import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
  routeTestTicketResponse,
} from "../tickets.routes.testUtils.js";

describe("ticket list route success", () => {
  it("lists tickets for an organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets?limit=10&createdBefore=2026-01-02T00%3A00%3A00.000Z`,
        headers: await createRouteTestAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        tickets: [routeTestTicketResponse],
      });
    } finally {
      await app.close();
    }
  });
});
