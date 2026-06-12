import { describe, expect, it, vi } from "vitest";

import { organizationNotFoundMessage } from "../../domain/organizations.constants.js";
import {
  createOrganizationsRepository,
  createOrganizationsService,
  organizationServiceTestOrganization,
} from "./organizations.service.testUtils.js";

describe("OrganizationsService getOrganization", () => {
  it("returns an organization by id", async () => {
    const organizationsRepository = createOrganizationsRepository();
    const service = createOrganizationsService({ organizationsRepository });

    const result = await service.getOrganization({
      organizationId: organizationServiceTestOrganization.id,
    });

    expect(result).toEqual({
      status: "found",
      organization: organizationServiceTestOrganization,
    });
    expect(organizationsRepository.findById).toHaveBeenCalledWith(
      organizationServiceTestOrganization.id,
    );
  });

  it("reports a missing organization", async () => {
    const organizationsRepository = createOrganizationsRepository({
      findById: vi.fn(() => Promise.resolve(null)),
    });
    const service = createOrganizationsService({ organizationsRepository });

    const result = await service.getOrganization({
      organizationId: organizationServiceTestOrganization.id,
    });

    expect(result).toEqual({
      status: "not-found",
      message: organizationNotFoundMessage,
    });
  });
});
