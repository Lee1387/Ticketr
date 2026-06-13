import { describe, expect, it, vi } from "vitest";

import { organizationNotFoundMessage } from "../../../../domain/organizations.constants.js";
import {
  createOrganizationMembersReader,
  createOrganizationsRepository,
  createOrganizationsService,
  organizationServiceTestMember,
  organizationServiceTestOrganization,
} from "../../helpers/organizations.service.testUtils.js";

describe("OrganizationsService listOrganizationMembers", () => {
  it("lists organization members", async () => {
    const createdBefore = new Date("2026-01-02T00:00:00.000Z");
    const organizationsRepository = createOrganizationsRepository();
    const organizationMembersReader = createOrganizationMembersReader();
    const service = createOrganizationsService({
      organizationMembersReader,
      organizationsRepository,
    });

    const result = await service.listOrganizationMembers({
      organizationId: organizationServiceTestOrganization.id,
      query: {
        limit: 10,
        createdBefore,
      },
    });

    expect(result).toEqual({
      status: "found",
      members: [organizationServiceTestMember],
    });
    expect(organizationMembersReader.listByOrganizationId).toHaveBeenCalledWith({
      organizationId: organizationServiceTestOrganization.id,
      limit: 10,
      createdBefore,
    });
  });

  it("reports a missing organization before listing members", async () => {
    const organizationsRepository = createOrganizationsRepository({
      findById: vi.fn(() => Promise.resolve(null)),
    });
    const organizationMembersReader = createOrganizationMembersReader();
    const service = createOrganizationsService({
      organizationMembersReader,
      organizationsRepository,
    });

    const result = await service.listOrganizationMembers({
      organizationId: organizationServiceTestOrganization.id,
      query: {
        limit: 10,
      },
    });

    expect(result).toEqual({
      status: "not-found",
      message: organizationNotFoundMessage,
    });
    expect(organizationMembersReader.listByOrganizationId).not.toHaveBeenCalled();
  });
});
