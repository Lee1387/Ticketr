import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { TicketsService } from "../tickets.service.js";
import {
  createRouteTestAuthHeaders,
  createRouteTestTicketsRepository,
  routeTestOrganizationId,
  routeTestOrganizationLookup,
  routeTestTicketId,
  routeTestTicketResponse,
} from "./tickets.routes.testUtils.js";

describe("ticket read routes", () => {
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

  it("requires authentication when listing tickets", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets`,
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("prevents listing another organization's tickets", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: "/organizations/de4d1aba-8c93-4a2a-9844-856e5976da48/tickets",
        headers: await createRouteTestAuthHeaders(app),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to this organization's tickets.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects invalid ticket list queries", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets?limit=0`,
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

  it("returns a ticket scoped to an organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets/${routeTestTicketId}`,
        headers: await createRouteTestAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        ticket: routeTestTicketResponse,
      });
    } finally {
      await app.close();
    }
  });

  it("returns not found when the ticket does not exist in the organization", async () => {
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
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets/${routeTestTicketId}`,
        headers: await createRouteTestAuthHeaders(app),
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

  it("rejects invalid ticket identifiers", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets/not-a-ticket-id`,
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
