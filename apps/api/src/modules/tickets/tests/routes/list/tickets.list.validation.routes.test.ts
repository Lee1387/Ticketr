import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { routeTestOrganizationId } from "../tickets.routes.testUtils.js";

describe("ticket list route validation", () => {
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
});
