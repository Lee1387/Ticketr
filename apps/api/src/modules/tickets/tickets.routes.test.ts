import { describe, expect, it } from "vitest";

import { buildApp } from "../../app/buildApp.js";

describe("ticket routes", () => {
  const organizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

  it("validates ticket creation requests before persistence exists", async () => {
    const app = buildApp();

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
    const app = buildApp();

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

  it("rejects invalid organization identifiers", async () => {
    const app = buildApp();

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
