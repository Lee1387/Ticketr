import type { UserId } from "../../../users/domain/users.types.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
  OrganizationMemberStatus,
} from "../../domain/organizations.types.js";
import type {
  Organization,
  OrganizationMember,
  OrganizationMemberRoleAssignment,
  OrganizationMemberStatusAssignment,
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
  }) => Promise<{
    membershipStatus: OrganizationMemberStatus;
    role: OrganizationMemberRole;
  } | null>;
};

export type OrganizationMemberRoleUpdaterPort = {
  updateRoleByOrganizationIdAndUserId: (input: {
    currentRole: OrganizationMemberRole;
    currentStatus: OrganizationMemberStatus;
    organizationId: OrganizationId;
    role: OrganizationMemberRole;
    userId: UserId;
  }) => Promise<OrganizationMemberRoleAssignment | null>;
};

export type OrganizationMemberStatusUpdaterPort = {
  updateStatusByOrganizationIdAndUserId: (input: {
    currentStatus: OrganizationMemberStatus;
    organizationId: OrganizationId;
    status: OrganizationMemberStatus;
    userId: UserId;
  }) => Promise<OrganizationMemberStatusAssignment | null>;
};
