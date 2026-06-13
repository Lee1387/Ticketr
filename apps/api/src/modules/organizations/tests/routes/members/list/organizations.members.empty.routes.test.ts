import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import {
  defaultTestOrganizationMemberRoleLookup,
  defaultTestOrganizationMemberRoleUpdater,
  defaultTestOrganizationMemberStatusUpdater,
  defaultTestOrganizationsRepository,
} from "../../../../../../test/repositories/organizationsTestRepository.js";
import { OrganizationsService } from "../../../../service/organizations.service.js";
import { organizationRouteTestOrganization } from "../../organizations.routes.testUtils.js";

describe("organization members route empty state", () => {
  it("returns an empty member list", async () => {
    const app = createTestApp({
      services: {
        organizationsService: new OrganizationsService(
          defaultTestOrganizationsRepository,
          {
            listByOrganizationId: vi.fn(() => Promise.resolve([])),
          },
          defaultTestOrganizationMemberRoleLookup,
          defaultTestOrganizationMemberRoleUpdater,
          defaultTestOrganizationMemberStatusUpdater,
        ),
      },
    });

    try {
      const response = await app.inject({
        method: "GET",
        url: `/organizations/${organizationRouteTestOrganization.id}/members`,
        headers: await createAuthHeaders(app),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        members: [],
      });
    } finally {
      await app.close();
    }
  });
});
