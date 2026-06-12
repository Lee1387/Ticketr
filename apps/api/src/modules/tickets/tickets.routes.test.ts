import { describe, expect, it } from "vitest";

import { createTestApp } from "../../test/createTestApp.js";
import { TicketsService, type OrganizationLookup } from "./tickets.service.js";

describe("ticket routes", () => {
  const organizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

  it("returns not implemented for an existing organization", async () => {
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

      expect(response.statusCode).toBe(501);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_IMPLEMENTED",
          message: "Ticket creation is not implemented yet.",
        },
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
    const app = createTestApp({
      services: {
        ticketsService: new TicketsService(organizationLookup),
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
