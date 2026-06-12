import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { createRouteTestAuthHeaders, routeTestTicketId } from "../tickets.routes.testUtils.js";

describe("ticket status route authorization", () => {
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
});
