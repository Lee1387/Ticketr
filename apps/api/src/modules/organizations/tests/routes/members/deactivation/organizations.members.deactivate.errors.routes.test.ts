import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../../test/createTestApp.js";
import {
  defaultTestOrganizationMemberRoleLookup,
  defaultTestOrganizationMemberRoleUpdater,
  defaultTestOrganizationMemberStatusUpdater,
  defaultTestOrganizationMembersReader,
  defaultTestOrganizationsRepository,
} from "../../../../../../test/repositories/organizationsTestRepository.js";
import { OrganizationsService } from "../../../../service/organizations.service.js";
import {
  createOrganizationRouteAccessService,
  organizationMemberRouteTestUserId,
  organizationRouteTestOrganization,
} from "../../organizations.routes.testUtils.js";

describe("organization member deactivation route errors", () => {
  it("returns not found when the organization does not exist", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createOrganizationRouteAccessService("owner"),
        organizationsService: new OrganizationsService(
          {
            findById: vi.fn(() => Promise.resolve(null)),
          },
          defaultTestOrganizationMembersReader,
          defaultTestOrganizationMemberRoleLookup,
          defaultTestOrganizationMemberRoleUpdater,
          defaultTestOrganizationMemberStatusUpdater,
        ),
      },
    });

    try {
      const response = await deactivateMember(app);

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

  it("returns not found when the member does not exist", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createOrganizationRouteAccessService("owner"),
        organizationsService: new OrganizationsService(
          defaultTestOrganizationsRepository,
          defaultTestOrganizationMembersReader,
          {
            findRoleByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
          },
          defaultTestOrganizationMemberRoleUpdater,
          defaultTestOrganizationMemberStatusUpdater,
        ),
      },
    });

    try {
      const response = await deactivateMember(app);

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        error: {
          code: "NOT_FOUND",
          message: "Organization member was not found.",
        },
      });
    } finally {
      await app.close();
    }
  });

  it("returns conflict when the member status changed before update", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createOrganizationRouteAccessService("owner"),
        organizationsService: new OrganizationsService(
          defaultTestOrganizationsRepository,
          defaultTestOrganizationMembersReader,
          defaultTestOrganizationMemberRoleLookup,
          defaultTestOrganizationMemberRoleUpdater,
          {
            updateStatusByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
          },
        ),
      },
    });

    try {
      const response = await deactivateMember(app);

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        error: {
          code: "CONFLICT",
          message: "Organization member status changed before it could be updated.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

async function deactivateMember(app: ReturnType<typeof createTestApp>) {
  return app.inject({
    method: "DELETE",
    url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRouteTestUserId}`,
    headers: await createAuthHeaders(app),
  });
}
