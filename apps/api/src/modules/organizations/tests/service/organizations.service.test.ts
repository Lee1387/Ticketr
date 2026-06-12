import { describe, expect, it, vi } from "vitest";

import { organizationNotFoundMessage } from "../../domain/organizations.constants.js";
import { OrganizationsService } from "../../service/organizations.service.js";
import type { OrganizationsRepositoryPort } from "../../service/organizations.service.ports.js";

describe("OrganizationsService", () => {
  const organization = {
    id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
    name: "Acme Support",
    status: "active" as const,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  function createOrganizationsRepository(
    overrides: Partial<OrganizationsRepositoryPort> = {},
  ): OrganizationsRepositoryPort {
    return {
      findById: vi.fn(() => Promise.resolve(organization)),
      ...overrides,
    };
  }

  it("returns an organization by id", async () => {
    const organizationsRepository = createOrganizationsRepository();
    const service = new OrganizationsService(organizationsRepository);

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
    const service = new OrganizationsService(organizationsRepository);

    const result = await service.getOrganization({
      organizationId: organization.id,
    });

    expect(result).toEqual({
      status: "not-found",
      message: organizationNotFoundMessage,
    });
  });
});
