import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
  routeTestTicketResponse,
} from "../tickets.routes.testUtils.js";

describe("ticket creation route success", () => {
  it("creates a ticket for an existing organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${routeTestOrganizationId}/tickets`,
        headers: {
          "content-type": "application/json",
          ...(await createRouteTestAuthHeaders(app)),
        },
        payload: JSON.stringify({
          subject: "Cannot access account",
          description: "The customer cannot sign in after resetting their password.",
          priority: "high",
        }),
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({
        ticket: routeTestTicketResponse,
      });
    } finally {
      await app.close();
    }
  });
});
