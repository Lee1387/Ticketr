import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { TicketsService, type Ticket } from "../tickets.service.js";
import {
  createRouteTestTicketsRepository,
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
  routeTestOrganizationLookup,
  routeTestTicket,
  routeTestTicketId,
  routeTestTicketResponse,
} from "./tickets.routes.testUtils.js";

describe("ticket status routes", () => {
  const updatedTicketResponse = {
    ...routeTestTicketResponse,
    status: "pending",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };

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
        ticket: updatedTicketResponse,
      });
    } finally {
      await app.close();
    }
  });

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

  it("prevents updating another organization's ticket status", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/de4d1aba-8c93-4a2a-9844-856e5976da48/tickets/${routeTestTicketId}/status`,
        headers: {
          "content-type": "application/json",
          ...(await createRouteTestAuthHeaders(app)),
        },
        payload: JSON.stringify({
          status: "pending",
        }),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to update ticket status for this organization.",
        },
      });
    } finally {
      await app.close();
    }
  });

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

  it("rejects invalid ticket status updates", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "PATCH",
        url: `/organizations/${routeTestOrganizationId}/tickets/${routeTestTicketId}/status`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          status: "waiting",
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
