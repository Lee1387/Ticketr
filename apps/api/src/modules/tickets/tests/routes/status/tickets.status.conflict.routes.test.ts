import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { TicketsService } from "../../../service/tickets.service.js";
import type { Ticket } from "../../../service/tickets.service.models.js";
import {
  createRouteTestAuthHeaders,
  createRouteTestTicketsRepository,
  routeTestOrganizationId,
  routeTestOrganizationLookup,
  routeTestTicket,
  routeTestTicketId,
} from "../tickets.routes.testUtils.js";

describe("ticket status route conflicts", () => {
  it("returns conflict for unsupported ticket status transitions", async () => {
    const closedTicket: Ticket = {
      ...routeTestTicket,
      status: "closed",
    };
    const app = createTestApp({
      services: {
        ticketsService: new TicketsService(
          routeTestOrganizationLookup,
          createRouteTestTicketsRepository({
            findByOrganizationIdAndId: vi.fn(() => Promise.resolve(closedTicket)),
          }),
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
          status: "resolved",
        }),
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        error: {
          code: "CONFLICT",
          message: "Ticket status transition is not allowed.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
