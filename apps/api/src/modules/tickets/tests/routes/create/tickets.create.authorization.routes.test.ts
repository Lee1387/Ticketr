import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
} from "../tickets.routes.testUtils.js";

describe("ticket creation route authorization", () => {
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

  it("rejects unauthenticated ticket creation before authorization checks", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "POST",
        url: `/organizations/${routeTestOrganizationId}/tickets`,
        headers: {
          "content-type": "application/json",
        },
        payload: JSON.stringify({
          subject: "Cannot access account",
          description: "The customer cannot sign in after resetting their password.",
          priority: "high",
        }),
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
});
