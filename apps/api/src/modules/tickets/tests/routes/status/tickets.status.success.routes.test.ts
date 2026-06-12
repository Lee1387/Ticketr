import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
  routeTestTicketId,
  routeTestTicketResponse,
} from "../tickets.routes.testUtils.js";

describe("ticket status route success", () => {
  it("updates a ticket status", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/${routeTestOrganizationId}/tickets/${routeTestTicketId}/status`,
        headers: {
          "content-type": "application/json",
          ...(await createRouteTestAuthHeaders(app)),
        },
        payload: JSON.stringify({
          status: "pending",
        }),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        ticket: {
          ...routeTestTicketResponse,
          status: "pending",
          updatedAt: "2026-01-02T00:00:00.000Z",
        },
      });
    } finally {
      await app.close();
    }
  });
});
