import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../test/createTestApp.js";
import { TicketsService } from "../tickets.service.js";
import type { OrganizationLookup } from "../tickets.service.types.js";
import {
  createRouteTestTicketsRepository,
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
  routeTestTicketResponse,
} from "./tickets.routes.testUtils.js";

describe("ticket creation routes", () => {
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

  it("rejects invalid ticket creation requests", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${routeTestOrganizationId}/tickets`,
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

  it("prevents creating another organization's tickets", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: "/organizations/de4d1aba-8c93-4a2a-9844-856e5976da48/tickets",
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

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to create tickets for this organization.",
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
    const app = createTestApp({
      services: {
        ticketsService: new TicketsService(organizationLookup, createRouteTestTicketsRepository()),
      },
    });

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
