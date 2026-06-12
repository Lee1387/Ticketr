import type { AuthenticatedUser } from "../../../app/auth/authContext.js";
import type { OrganizationId, OrganizationMemberRole } from "../domain/organizations.types.js";

export type VerifyOrganizationMembershipQuery = {
  auth: AuthenticatedUser;
  organizationId: OrganizationId;
};

export type VerifyOrganizationMembershipResult =
  | {
      status: "verified";
      role: OrganizationMemberRole;
    }
  | {
      status: "not-member";
    };
