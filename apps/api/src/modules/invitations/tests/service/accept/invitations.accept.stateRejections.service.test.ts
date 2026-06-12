import { describe, expect, it, vi } from "vitest";

import {
  invitationAlreadyAcceptedMessage,
  invitationExpiredMessage,
  invitationNotFoundMessage,
} from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestUserId,
} from "../../helpers/invitations.service.fixtures.js";
import {
  createServiceTestInvitationAcceptanceRepository,
  createServiceTestInvitationsRepository,
} from "../../helpers/invitations.service.repositories.js";

describe("InvitationsService acceptInvitation state rejections", () => {
  const acceptedAt = new Date("2026-01-02T00:00:00.000Z");

  it("rejects expired invitations without accepting them", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository({
      findPendingById: vi.fn(() =>
        Promise.resolve({
          ...invitationServiceTestInvitation,
          expiresAt: new Date("2026-01-01T00:00:00.000Z"),
        }),
      ),
    });
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository();
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
      status: "conflict",
      message: invitationExpiredMessage,
    });
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).not.toHaveBeenCalled();
  });

  it("rejects users who are already organization members", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository();
    const service = createServiceTestInvitationsService({
      invitationAcceptanceRepository,
      invitationsRepository,
      membershipLookup: {
        findByOrganizationIdAndUserId: vi.fn(() =>
          Promise.resolve({
            role: "agent" as const,
          }),
        ),
      },
      now: () => acceptedAt,
    });

    const result = await service.acceptInvitation({
      invitationId: invitationServiceTestInvitation.id,
      userId: invitationServiceTestUserId,
    });

    expect(result).toEqual({
      status: "conflict",
      message: invitationAlreadyAcceptedMessage,
    });
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).not.toHaveBeenCalled();
  });

  it("reports not found when the pending invitation changes before accepting", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository({
      acceptPendingByIdAndCreateMembership: vi.fn(() => Promise.resolve(null)),
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
      status: "not-found",
      message: invitationNotFoundMessage,
    });
  });
});
