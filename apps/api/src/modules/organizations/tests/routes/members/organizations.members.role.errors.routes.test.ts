import { describe, expect, it, vi } from "vitest";

import { createAuthHeaders } from "../../../../../test/authTestUtils.js";
import { createTestApp } from "../../../../../test/createTestApp.js";
import {
  defaultTestOrganizationMemberRoleLookup,
  defaultTestOrganizationMemberRoleUpdater,
  defaultTestOrganizationMembersReader,
  defaultTestOrganizationsRepository,
} from "../../../../../test/repositories/organizationsTestRepository.js";
import { OrganizationsService } from "../../../service/organizations.service.js";
import {
  createOrganizationRouteAccessService,
  organizationMemberRoleRouteTestUserId,
  organizationRouteTestOrganization,
} from "../organizations.routes.testUtils.js";

describe("organization member role route errors", () => {
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
        ),
      },
    });

    try {
      const response = await updateRole(app);

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
          {
            updateRoleByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
          },
        ),
      },
    });

    try {
      const response = await updateRole(app);

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

  it("returns conflict when the member role changed before update", async () => {
    const app = createTestApp({
      services: {
        organizationAccessService: createOrganizationRouteAccessService("owner"),
        organizationsService: new OrganizationsService(
          defaultTestOrganizationsRepository,
          defaultTestOrganizationMembersReader,
          defaultTestOrganizationMemberRoleLookup,
          {
            updateRoleByOrganizationIdAndUserId: vi.fn(() => Promise.resolve(null)),
          },
        ),
      },
    });

    try {
      const response = await updateRole(app);

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        error: {
          code: "CONFLICT",
          message: "Organization member role changed before it could be updated.",
        },
      });
    } finally {
      await app.close();
    }
  });
});

async function updateRole(app: ReturnType<typeof createTestApp>) {
  return app.inject({
    method: "PATCH",
    url: `/organizations/${organizationRouteTestOrganization.id}/members/${organizationMemberRoleRouteTestUserId}/role`,
    headers: {
      "content-type": "application/json",
      ...(await createAuthHeaders(app)),
    },
    payload: JSON.stringify({
      role: "admin",
    }),
  });
}
