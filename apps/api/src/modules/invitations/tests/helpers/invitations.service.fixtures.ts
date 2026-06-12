import type { OrganizationId } from "../../../organizations/domain/organizations.types.js";
import type { UserId } from "../../../users/domain/users.types.js";
import type { Invitation } from "../../service/invitations.service.models.js";

export const invitationServiceTestOrganizationId =
  "11111111-1111-4111-8111-111111111111" as OrganizationId;

export const invitationServiceTestUserId = "33333333-3333-4333-8333-333333333333" as UserId;

export const invitationServiceTestInvitation: Invitation = {
  acceptedAt: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  email: "agent@example.com",
  expiresAt: new Date("2026-01-08T00:00:00.000Z"),
  id: "22222222-2222-4222-8222-222222222222",
  organizationId: invitationServiceTestOrganizationId,
  role: "agent",
  status: "pending",
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};
