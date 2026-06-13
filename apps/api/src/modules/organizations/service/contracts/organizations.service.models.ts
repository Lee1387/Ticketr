import type { UserEmail, UserId, UserStatus } from "../../../users/domain/users.types.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
  OrganizationMemberStatus,
  OrganizationStatus,
} from "../../domain/organizations.types.js";

export type Organization = {
  id: OrganizationId;
  name: string;
  status: OrganizationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationMember = {
  createdAt: Date;
  email: UserEmail;
  membershipStatus: OrganizationMemberStatus;
  name: string;
  role: OrganizationMemberRole;
  status: UserStatus;
  userId: UserId;
};

export type OrganizationMemberRoleAssignment = {
  membershipStatus: OrganizationMemberStatus;
  organizationId: OrganizationId;
  role: OrganizationMemberRole;
  userId: UserId;
};

export type OrganizationMemberStatusAssignment = OrganizationMemberRoleAssignment;
