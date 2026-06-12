import { describe, expect, it, vi } from "vitest";

import {
  invitationEmailMismatchMessage,
  invitationUserInactiveMessage,
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

describe("InvitationsService acceptInvitation user rejections", () => {
  const acceptedAt = new Date("2026-01-02T00:00:00.000Z");

  it("rejects inactive accepting users", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository();
    const service = createServiceTestInvitationsService({
      invitationAcceptanceRepository,
      invitationsRepository,
      now: () => acceptedAt,
      userLookup: {
        findById: vi.fn(() =>
          Promise.resolve({
            email: invitationServiceTestInvitation.email,
            id: invitationServiceTestUserId,
            status: "suspended" as const,
          }),
        ),
      },
    });

    const result = await service.acceptInvitation({
      invitationId: invitationServiceTestInvitation.id,
      userId: invitationServiceTestUserId,
    });

    expect(result).toEqual({
      status: "conflict",
      message: invitationUserInactiveMessage,
    });
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).not.toHaveBeenCalled();
  });

  it("rejects users with a different email address", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository();
    const service = createServiceTestInvitationsService({
      invitationAcceptanceRepository,
      invitationsRepository,
      now: () => acceptedAt,
      userLookup: {
        findById: vi.fn(() =>
          Promise.resolve({
            email: "someone-else@example.com",
            id: invitationServiceTestUserId,
            status: "active" as const,
          }),
        ),
      },
    });

    const result = await service.acceptInvitation({
      invitationId: invitationServiceTestInvitation.id,
      userId: invitationServiceTestUserId,
    });

    expect(result).toEqual({
      status: "conflict",
      message: invitationEmailMismatchMessage,
    });
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).not.toHaveBeenCalled();
  });
});
