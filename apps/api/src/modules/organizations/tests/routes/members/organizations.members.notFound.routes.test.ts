import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  defaultTestOrganizationMemberRoleLookup,
  defaultTestOrganizationMemberRoleUpdater,
  defaultTestOrganizationMembersReader,
} from "../../../../../test/repositories/organizationsTestRepository.js";
import { OrganizationsService } from "../../../service/organizations.service.js";
import { organizationRouteTestOrganization } from "../organizations.routes.testUtils.js";

describe("organization members route not found handling", () => {
  it("returns not found when an organization does not exist", async () => {
    const app = createTestApp({
      services: {
        organizationsService: new OrganizationsService(
          {
            findById: vi.fn(() => Promise.resolve(null)),
          },
          defaultTestOrganizationMembersReader,
          defaultTestOrganizationMemberRoleLookup,
          defaultTestOrganizationMemberRoleUpdater,
        ),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationRouteTestOrganization.id}/members`,
        headers: await createAuthHeaders(app),
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
