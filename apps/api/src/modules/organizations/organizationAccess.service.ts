import type { AuthenticatedUser } from "../../app/auth/authContext.js";
import type { OrganizationId, OrganizationMemberRole } from "./organizations.types.js";

export type OrganizationMembershipLookup = {
  findByOrganizationIdAndUserId: (input: {
    organizationId: OrganizationId;
    userId: string;
  }) => Promise<{ role: OrganizationMemberRole } | null>;
};

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

export class OrganizationAccessService {
  constructor(private readonly organizationMembershipLookup: OrganizationMembershipLookup) {}

  async verifyOrganizationMembership(
    query: VerifyOrganizationMembershipQuery,
  ): Promise<VerifyOrganizationMembershipResult> {
    if (query.auth.organizationId !== query.organizationId) {
      return { status: "not-member" };
    }

    const membership = await this.organizationMembershipLookup.findByOrganizationIdAndUserId({
      organizationId: query.organizationId,
      userId: query.auth.userId,
    });

    if (membership === null) {
      return { status: "not-member" };
    }

    return {
      status: "verified",
      role: membership.role,
    };
  }
}
