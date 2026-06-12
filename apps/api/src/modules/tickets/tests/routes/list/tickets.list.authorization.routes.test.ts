import { describe, expect, it } from "vitest";

import { createTestApp } from "../../../../../test/createTestApp.js";
import { OrganizationAccessService } from "../../../../organizations/service/organizationAccess.service.js";
import {
  createRouteTestAuthHeaders,
  routeTestOrganizationId,
} from "../tickets.routes.testUtils.js";

describe("ticket list route authorization", () => {
  it("requires authentication when listing tickets", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets`,
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

  it("prevents listing another organization's tickets", async () => {
    const app = createTestApp();

    try {
      const response = await app.inject({
        method: "GET",
        url: "/organizations/de4d1aba-8c93-4a2a-9844-856e5976da48/tickets",
        headers: await createRouteTestAuthHeaders(app),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to this organization's tickets.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("prevents listing tickets when the authenticated user is not an organization member", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: new OrganizationAccessService({
          findByOrganizationIdAndUserId: () => Promise.resolve(null),
        }),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${routeTestOrganizationId}/tickets`,
        headers: await createRouteTestAuthHeaders(app),
      });

      expect(response.statusCode).toBe(403);
      expect(response.json()).toEqual({
        error: {
          code: "FORBIDDEN",
          message: "You do not have access to this organization's tickets.",
        },
      });
    } finally {
      await app.close();
    }
  });
});
