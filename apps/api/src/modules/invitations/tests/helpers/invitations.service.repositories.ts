import { vi } from "vitest";

import type {
  InvitationAcceptanceRepositoryPort,
  InvitationsRepositoryPort,
} from "../../service/invitations.service.ports.js";
import { invitationServiceTestInvitation } from "./invitations.service.fixtures.js";

const revokedInvitation = {
  ...invitationServiceTestInvitation,
  status: "revoked" as const,
};

export function createServiceTestInvitationsRepository(
  overrides: Partial<InvitationsRepositoryPort> = {},
): InvitationsRepositoryPort {
  return {
    create: vi.fn(() => Promise.resolve(invitationServiceTestInvitation)),
    findPendingByOrganizationIdAndEmail: vi.fn(() => Promise.resolve(null)),
    findPendingById: vi.fn(() => Promise.resolve(invitationServiceTestInvitation)),
    revokePendingById: vi.fn(() => Promise.resolve(revokedInvitation)),
    ...overrides,
  };
}

export function createServiceTestInvitationAcceptanceRepository(
  overrides: Partial<InvitationAcceptanceRepositoryPort> = {},
): InvitationAcceptanceRepositoryPort {
  return {
    acceptPendingByIdAndCreateMembership: vi.fn(
      (
        input: Parameters<
          InvitationAcceptanceRepositoryPort["acceptPendingByIdAndCreateMembership"]
        >[0],
      ) =>
        Promise.resolve({
          ...invitationServiceTestInvitation,
          acceptedAt: input.acceptedAt,
          id: input.id,
          status: "accepted" as const,
        }),
    ),
    ...overrides,
  };
}
