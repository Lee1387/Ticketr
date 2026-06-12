import type {
  InvitationAcceptanceRepositoryPort,
  InvitationsRepositoryPort,
} from "../../modules/invitations/service/invitations.service.ports.js";
import { defaultTestInvitation } from "../fixtures/invitations.fixture.js";

export const defaultTestInvitationsRepository: InvitationsRepositoryPort = {
  create: (input) =>
    Promise.resolve({
      ...defaultTestInvitation,
      email: input.email,
      expiresAt: input.expiresAt,
      organizationId: input.organizationId,
      role: input.role,
    }),
  findPendingByOrganizationIdAndEmail: () => Promise.resolve(null),
  findPendingById: (id) =>
    Promise.resolve({
      ...defaultTestInvitation,
      id,
    }),
  revokePendingById: (id) =>
    Promise.resolve({
      ...defaultTestInvitation,
      id,
      status: "revoked",
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    }),
};

export const defaultTestInvitationAcceptanceRepository: InvitationAcceptanceRepositoryPort = {
  acceptPendingByIdAndCreateMembership: (input) =>
    Promise.resolve({
      ...defaultTestInvitation,
      acceptedAt: input.acceptedAt,
      id: input.id,
      status: "accepted",
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    }),
};
