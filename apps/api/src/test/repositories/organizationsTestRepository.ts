import type { OrganizationMembershipLookup } from "../../modules/organizations/service/organizationAccess.service.ports.js";
import type { OrganizationsRepositoryPort } from "../../modules/organizations/service/organizations.service.ports.js";
import { defaultTestOrganization } from "../fixtures/organizations.fixture.js";

export const defaultTestOrganizationsRepository: OrganizationsRepositoryPort = {
  findById: (id) =>
    Promise.resolve({
      ...defaultTestOrganization,
      id,
    }),
};

export const defaultTestOrganizationMembershipLookup: OrganizationMembershipLookup = {
  findByOrganizationIdAndUserId: () => Promise.resolve({ role: "agent" as const }),
};
