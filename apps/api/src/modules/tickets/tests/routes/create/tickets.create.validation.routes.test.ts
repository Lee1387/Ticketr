import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { routeTestOrganizationId } from "../tickets.routes.testUtils.js";

describe("ticket creation route validation", () => {
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
