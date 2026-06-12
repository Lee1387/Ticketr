import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { TicketsService } from "../../../service/tickets.service.js";
import type { OrganizationLookup } from "../../../service/tickets.service.ports.js";
import {
  createRouteTestAuthHeaders,
  createRouteTestTicketsRepository,
  routeTestOrganizationId,
} from "../tickets.routes.testUtils.js";

describe("ticket creation route not found handling", () => {
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
});
