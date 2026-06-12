import type { UserEmail, UserId, UserStatus } from "../../users/domain/users.types.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
  OrganizationStatus,
} from "../domain/organizations.types.js";

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
  name: string;
  role: OrganizationMemberRole;
  status: UserStatus;
  userId: UserId;
};

export type OrganizationMemberRoleAssignment = {
  organizationId: OrganizationId;
  role: OrganizationMemberRole;
  userId: UserId;
};
