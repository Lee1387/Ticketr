import { describe, expect, it, vi } from "vitest";

import { organizationNotFoundMessage } from "../../domain/organizations.constants.js";
import { OrganizationsService } from "../../service/organizations.service.js";
import type {
  OrganizationMembersReaderPort,
  OrganizationsRepositoryPort,
} from "../../service/organizations.service.ports.js";

describe("OrganizationsService", () => {
  const organization = {
    id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
    name: "Acme Support",
    status: "active" as const,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  const member = {
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    email: "agent@example.com",
    name: "Support Agent",
    role: "agent" as const,
    status: "active" as const,
    userId: "11111111-1111-4111-8111-111111111111",
  };

  function createOrganizationsRepository(
    overrides: Partial<OrganizationsRepositoryPort> = {},
  ): OrganizationsRepositoryPort {
    return {
      findById: vi.fn(() => Promise.resolve(organization)),
      ...overrides,
    };
  }

  function createOrganizationMembersReader(
    overrides: Partial<OrganizationMembersReaderPort> = {},
  ): OrganizationMembersReaderPort {
    return {
      listByOrganizationId: vi.fn(() => Promise.resolve([member])),
      ...overrides,
    };
  }

  it("returns an organization by id", async () => {
    const organizationsRepository = createOrganizationsRepository();
    const service = new OrganizationsService(
      organizationsRepository,
      createOrganizationMembersReader(),
    );

    const result = await service.getOrganization({
      organizationId: organization.id,
    });

    expect(result).toEqual({
      status: "found",
      organization,
    });
    expect(organizationsRepository.findById).toHaveBeenCalledWith(organization.id);
  });

  it("reports a missing organization", async () => {
    const organizationsRepository = createOrganizationsRepository({
      findById: vi.fn(() => Promise.resolve(null)),
    });
    const service = new OrganizationsService(
      organizationsRepository,
      createOrganizationMembersReader(),
    );

    const result = await service.getOrganization({
      organizationId: organization.id,
    });

    expect(result).toEqual({
      status: "not-found",
      message: organizationNotFoundMessage,
    });
  });

  it("lists organization members", async () => {
    const createdBefore = new Date("2026-01-02T00:00:00.000Z");
    const organizationsRepository = createOrganizationsRepository();
    const organizationMembersReader = createOrganizationMembersReader();
    const service = new OrganizationsService(organizationsRepository, organizationMembersReader);

    const result = await service.listOrganizationMembers({
      organizationId: organization.id,
      query: {
        limit: 10,
        createdBefore,
      },
    });

    expect(result).toEqual({
      status: "found",
      members: [member],
    });
    expect(organizationMembersReader.listByOrganizationId).toHaveBeenCalledWith({
      organizationId: organization.id,
      limit: 10,
      createdBefore,
    });
  });

  it("reports a missing organization before listing members", async () => {
    const organizationsRepository = createOrganizationsRepository({
      findById: vi.fn(() => Promise.resolve(null)),
    });
    const organizationMembersReader = createOrganizationMembersReader();
    const service = new OrganizationsService(organizationsRepository, organizationMembersReader);

    const result = await service.listOrganizationMembers({
      organizationId: organization.id,
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
