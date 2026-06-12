import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { routeTestOrganizationId, routeTestTicketId } from "../tickets.routes.testUtils.js";

describe("ticket status route validation", () => {
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
