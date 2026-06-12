import { describe, expect, it, vi } from "vitest";

import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestUserId,
} from "../../helpers/invitations.service.fixtures.js";
import {
  createServiceTestInvitationAcceptanceRepository,
  createServiceTestInvitationsRepository,
} from "../../helpers/invitations.service.repositories.js";

describe("InvitationsService acceptInvitation success", () => {
  it("accepts a pending invitation before it expires", async () => {
    const acceptedAt = new Date("2026-01-02T00:00:00.000Z");
    const acceptedInvitation = {
      ...invitationServiceTestInvitation,
      acceptedAt,
      status: "accepted" as const,
    };
    const invitationsRepository = createServiceTestInvitationsRepository();
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository({
      acceptPendingByIdAndCreateMembership: vi.fn(() => Promise.resolve(acceptedInvitation)),
    });
    const service = createServiceTestInvitationsService({
      invitationAcceptanceRepository,
      invitationsRepository,
      now: () => acceptedAt,
    });

    const result = await service.acceptInvitation({
      invitationId: invitationServiceTestInvitation.id,
      userId: invitationServiceTestUserId,
    });

    expect(result).toEqual({
      status: "accepted",
      invitation: acceptedInvitation,
    });
    expect(invitationsRepository.findPendingById).toHaveBeenCalledWith(
      invitationServiceTestInvitation.id,
    );
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).toHaveBeenCalledWith({
      acceptedAt,
      id: invitationServiceTestInvitation.id,
      organizationId: invitationServiceTestInvitation.organizationId,
      role: invitationServiceTestInvitation.role,
      userId: invitationServiceTestUserId,
    });
  });
});
