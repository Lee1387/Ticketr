import { OrganizationAccessService } from "../../../organizations/service/access/organizationAccess.service.js";
import type { OrganizationMemberRole } from "../../../organizations/domain/organizations.types.js";

export const invitationRouteTestAcceptedAt = new Date("2026-01-02T00:00:00.000Z");

export const invitationRouteTestOrganizationId = "6b4df69e-0950-4209-b79a-a5b5d251540f";

export const invitationRouteTestBody = {
  email: "  AGENT@EXAMPLE.COM  ",
  expiresAt: "2026-01-08T00:00:00.000Z",
  role: "agent",
};

export function createRouteTestOrganizationAccessService(
  role: OrganizationMemberRole,
): OrganizationAccessService {
  return new OrganizationAccessService({
    findByOrganizationIdAndUserId: () => Promise.resolve({ membershipStatus: "active", role }),
  });
}
