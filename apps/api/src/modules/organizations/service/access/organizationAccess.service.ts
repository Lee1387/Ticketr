import type { OrganizationMembershipLookup } from "./organizationAccess.service.ports.js";
import type {
  VerifyOrganizationMembershipQuery,
  VerifyOrganizationMembershipResult,
} from "./organizationAccess.service.types.js";

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

    if (membership === null || membership.membershipStatus !== "active") {
      return { status: "not-member" };
    }

    return {
      status: "verified",
      role: membership.role,
    };
  }
}
