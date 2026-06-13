import { OrganizationAccessService } from "../../service/access/organizationAccess.service.js";
import type { OrganizationMemberRole } from "../../domain/organizations.types.js";

export const organizationRouteTestOrganization = {
  id: "6b4df69e-0950-4209-b79a-a5b5d251540f",
  name: "Acme Support",
  status: "active" as const,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

export const organizationRouteTestResponse = {
  id: organizationRouteTestOrganization.id,
  name: organizationRouteTestOrganization.name,
  status: organizationRouteTestOrganization.status,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const organizationMemberRouteTestResponse = {
  createdAt: "2026-01-01T00:00:00.000Z",
  email: "agent@example.com",
  membershipStatus: "active",
  name: "Support Agent",
  role: "agent",
  status: "active",
  userId: "11111111-1111-4111-8111-111111111111",
};

export const organizationMemberRouteTestUserId = "22222222-2222-4222-8222-222222222222";
export const organizationMemberRoleRouteTestUserId = organizationMemberRouteTestUserId;

export function createOrganizationRouteAccessService(
  role: OrganizationMemberRole,
): OrganizationAccessService {
  return new OrganizationAccessService({
    findByOrganizationIdAndUserId: () => Promise.resolve({ membershipStatus: "active", role }),
  });
}
