import { describe, expect, it, vi } from "vitest";

import { createTestApp } from "../../test/createTestApp.js";
import {
  type OrganizationLookup,
  type Ticket,
  type TicketsRepositoryPort,
  TicketsService,
} from "./tickets.service.js";

describe("ticket routes", () => {
  const organizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";
  const ticketId = "55555555-5555-4555-8555-555555555555";
  const ticket: Ticket = {
    id: ticketId,
    organizationId,
    subject: "Cannot access account",
    description: "The customer cannot sign in after resetting their password.",
    status: "open",
    priority: "high",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
  const ticketResponse = {
    id: ticketId,
    organizationId,
    subject: "Cannot access account",
    description: "The customer cannot sign in after resetting their password.",
    status: "open",
    priority: "high",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("lists tickets for an organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationId}/tickets?limit=10&createdBefore=2026-01-02T00%3A00%3A00.000Z`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        tickets: [ticketResponse],
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
        url: `/organizations/${organizationId}/tickets?limit=0`,
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
        url: `/organizations/${organizationId}/tickets/${ticketId}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        ticket: ticketResponse,
      });
    } finally {
      await app.close();
    }
  });

  it("returns not found when the ticket does not exist in the organization", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: (id) => Promise.resolve({ id }),
    };
    const ticketsRepository: TicketsRepositoryPort = {
      create: vi.fn(() => Promise.resolve(ticket)),
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
      listByOrganizationId: vi.fn(() => Promise.resolve([])),
    };
    const app = createTestApp({
      services: {
        ticketsService: new TicketsService(organizationLookup, ticketsRepository),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationId}/tickets/${ticketId}`,
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
        url: `/organizations/${organizationId}/tickets/not-a-ticket-id`,
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

  it("creates a ticket for an existing organization", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${organizationId}/tickets`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          subject: "Cannot access account",
          description: "The customer cannot sign in after resetting their password.",
          priority: "high",
        }),
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({
        ticket: ticketResponse,
      });
    } finally {
      await app.close();
    }
  });

  it("rejects invalid ticket creation requests", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${organizationId}/tickets`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          subject: "",
          description: "",
          priority: "high",
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

  it("returns not found when the target organization does not exist", async () => {
    const organizationLookup: OrganizationLookup = {
      findById: () => Promise.resolve(null),
    };
    const ticketsRepository: TicketsRepositoryPort = {
      create: vi.fn(() => Promise.resolve(ticket)),
      findByOrganizationIdAndId: vi.fn(() => Promise.resolve(null)),
      listByOrganizationId: vi.fn(() => Promise.resolve([])),
    };
    const app = createTestApp({
      services: {
        ticketsService: new TicketsService(organizationLookup, ticketsRepository),
      },
    });

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${organizationId}/tickets`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          subject: "Cannot access account",
          description: "The customer cannot sign in after resetting their password.",
          priority: "high",
        }),
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Organization was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("rejects invalid organization identifiers", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: "/organizations/not-an-organization-id/tickets",
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          subject: "Cannot access account",
          description: "The customer cannot sign in after resetting their password.",
          priority: "high",
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
