import { vi } from "vitest";

import { OrganizationsService } from "../../service/organizations.service.js";
import type {
  OrganizationMemberRoleLookupPort,
  OrganizationMemberRoleUpdaterPort,
  OrganizationMembersReaderPort,
  OrganizationsRepositoryPort,
} from "../../service/organizations.service.ports.js";

export const organizationServiceTestOrganization = {
  id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
  name: "Acme Support",
  status: "active" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const organizationServiceTestMember = {
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  email: "agent@example.com",
  name: "Support Agent",
  role: "agent" as const,
  status: "active" as const,
  userId: "11111111-1111-4111-8111-111111111111",
};

export const updateOrganizationMemberRoleServiceTestCommand = {
  actorRole: "admin" as const,
  input: {
    role: "agent" as const,
  },
  organizationId: organizationServiceTestOrganization.id,
  userId: organizationServiceTestMember.userId,
};

export function createOrganizationsRepository(
  overrides: Partial<OrganizationsRepositoryPort> = {},
): OrganizationsRepositoryPort {
  return {
    findById: vi.fn(() => Promise.resolve(organizationServiceTestOrganization)),
    ...overrides,
  };
}

export function createOrganizationMembersReader(
  overrides: Partial<OrganizationMembersReaderPort> = {},
): OrganizationMembersReaderPort {
  return {
    listByOrganizationId: vi.fn(() => Promise.resolve([organizationServiceTestMember])),
    ...overrides,
  };
}

export function createOrganizationMemberRoleLookup(
  overrides: Partial<OrganizationMemberRoleLookupPort> = {},
): OrganizationMemberRoleLookupPort {
  return {
    findRoleByOrganizationIdAndUserId: vi.fn<
      OrganizationMemberRoleLookupPort["findRoleByOrganizationIdAndUserId"]
    >(() => Promise.resolve({ role: "admin" })),
    ...overrides,
  };
}

export function createOrganizationMemberRoleUpdater(
  overrides: Partial<OrganizationMemberRoleUpdaterPort> = {},
): OrganizationMemberRoleUpdaterPort {
  return {
    updateRoleByOrganizationIdAndUserId: vi.fn<
      OrganizationMemberRoleUpdaterPort["updateRoleByOrganizationIdAndUserId"]
    >((input) =>
      Promise.resolve({
        organizationId: input.organizationId,
        role: input.role,
        userId: input.userId,
      }),
    ),
    ...overrides,
  };
}

export function createOrganizationsService(
  input: {
    organizationMemberRoleLookup?: OrganizationMemberRoleLookupPort;
    organizationMemberRoleUpdater?: OrganizationMemberRoleUpdaterPort;
    organizationMembersReader?: OrganizationMembersReaderPort;
    organizationsRepository?: OrganizationsRepositoryPort;
  } = {},
): OrganizationsService {
  return new OrganizationsService(
    input.organizationsRepository ?? createOrganizationsRepository(),
    input.organizationMembersReader ?? createOrganizationMembersReader(),
    input.organizationMemberRoleLookup ?? createOrganizationMemberRoleLookup(),
    input.organizationMemberRoleUpdater ?? createOrganizationMemberRoleUpdater(),
  );
}
