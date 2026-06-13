import type { UserId } from "../../../users/domain/users.types.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
  OrganizationMemberStatus,
} from "../../domain/organizations.types.js";

export type OrganizationMembershipLookup = {
  findByOrganizationIdAndUserId: (input: {
    organizationId: OrganizationId;
    userId: UserId;
  }) => Promise<{
    membershipStatus: OrganizationMemberStatus;
    role: OrganizationMemberRole;
  } | null>;
};
