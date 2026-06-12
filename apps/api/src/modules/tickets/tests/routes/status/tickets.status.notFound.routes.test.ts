import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { TicketsService } from "../../../service/tickets.service.js";
import {
  createRouteTestAuthHeaders,
  createRouteTestTicketsRepository,
  routeTestOrganizationId,
  routeTestOrganizationLookup,
  routeTestTicketId,
} from "../tickets.routes.testUtils.js";

describe("ticket status route not found handling", () => {
  it("returns not found when updating a missing ticket status", async () => {
    const app = createTestApp({
      services: {
        ticketsService: new TicketsService(
          routeTestOrganizationLookup,
          createRouteTestTicketsRepository(),
        ),
      },
    });

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

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Ticket was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
