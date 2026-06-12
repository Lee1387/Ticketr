import type {
  OrganizationId,
  OrganizationStatus,
} from "../../organizations/domain/organizations.types.js";
import type { UserEmail, UserId, UserStatus } from "../../users/domain/users.types.js";
import type { InvitationEmail, InvitationId, InvitationRole } from "../domain/invitations.types.js";
import type { Invitation } from "./invitations.service.models.js";

export type InvitationOrganizationLookup = {
  findById: (
    id: OrganizationId,
  ) => Promise<{ id: OrganizationId; status: OrganizationStatus } | null>;
};

export type InvitationUserLookup = {
  findById: (id: UserId) => Promise<{ email: UserEmail; id: UserId; status: UserStatus } | null>;
};

export type InvitationMembershipLookup = {
  findByOrganizationIdAndUserId: (input: {
    organizationId: OrganizationId;
    userId: UserId;
  }) => Promise<{ role: InvitationRole } | null>;
};

export type InvitationsRepositoryPort = {
  create: (input: {
    email: InvitationEmail;
    expiresAt: Date;
    organizationId: OrganizationId;
    role: InvitationRole;
  }) => Promise<Invitation>;
  listPendingByOrganizationId: (input: {
    createdBefore?: Date;
    limit: number;
    organizationId: OrganizationId;
  }) => Promise<Invitation[]>;
  findPendingByOrganizationIdAndEmail: (input: {
    email: InvitationEmail;
    organizationId: OrganizationId;
  }) => Promise<Invitation | null>;
  findPendingById: (id: InvitationId) => Promise<Invitation | null>;
  revokePendingById: (id: InvitationId) => Promise<Invitation | null>;
};

export type InvitationAcceptanceRepositoryPort = {
  acceptPendingByIdAndCreateMembership: (input: {
    acceptedAt: Date;
    id: InvitationId;
    organizationId: OrganizationId;
    role: InvitationRole;
    userId: UserId;
  }) => Promise<Invitation | null>;
};
