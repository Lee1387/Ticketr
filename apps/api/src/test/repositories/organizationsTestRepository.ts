import type { OrganizationMembershipLookup } from "../../modules/organizations/service/organizationAccess.service.ports.js";
import type {
  OrganizationMemberRoleLookupPort,
  OrganizationMemberRoleUpdaterPort,
  OrganizationMembersReaderPort,
  OrganizationsRepositoryPort,
} from "../../modules/organizations/service/organizations.service.ports.js";
import { defaultTestOrganization } from "../fixtures/organizations.fixture.js";
import { defaultTestUser } from "../fixtures/users.fixture.js";

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

export const defaultTestOrganizationMembersReader: OrganizationMembersReaderPort = {
  listByOrganizationId: () =>
    Promise.resolve([
      {
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        email: defaultTestUser.email,
        name: defaultTestUser.name,
        role: "agent",
        status: defaultTestUser.status,
        userId: defaultTestUser.id,
      },
    ]),
};

export const defaultTestOrganizationMemberRoleLookup: OrganizationMemberRoleLookupPort = {
  findRoleByOrganizationIdAndUserId: () => Promise.resolve({ role: "agent" }),
};

export const defaultTestOrganizationMemberRoleUpdater: OrganizationMemberRoleUpdaterPort = {
  updateRoleByOrganizationIdAndUserId: (input) =>
    Promise.resolve({
      organizationId: input.organizationId,
      role: input.role,
      userId: input.userId,
    }),
};
