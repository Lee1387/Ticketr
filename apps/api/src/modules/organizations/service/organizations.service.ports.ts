import type { UserId } from "../../users/domain/users.types.js";
import type { OrganizationId, OrganizationMemberRole } from "../domain/organizations.types.js";
import type {
  Organization,
  OrganizationMember,
  OrganizationMemberRoleAssignment,
} from "./organizations.service.models.js";

export type OrganizationsRepositoryPort = {
  findById: (id: OrganizationId) => Promise<Organization | null>;
};

export type OrganizationMembersReaderPort = {
  listByOrganizationId: (input: {
    createdBefore?: Date;
    limit: number;
    organizationId: OrganizationId;
  }) => Promise<OrganizationMember[]>;
};

export type OrganizationMemberRoleLookupPort = {
  findRoleByOrganizationIdAndUserId: (input: {
    organizationId: OrganizationId;
    userId: UserId;
  }) => Promise<{ role: OrganizationMemberRole } | null>;
};

export type OrganizationMemberRoleUpdaterPort = {
  updateRoleByOrganizationIdAndUserId: (input: {
    currentRole: OrganizationMemberRole;
    organizationId: OrganizationId;
    role: OrganizationMemberRole;
    userId: UserId;
  }) => Promise<OrganizationMemberRoleAssignment | null>;
};
