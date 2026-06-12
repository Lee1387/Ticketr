import { describe, expect, it, vi } from "vitest";

import {
  invitationNotFoundMessage,
  invitationUserNotFoundMessage,
} from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestUserId,
} from "../../helpers/invitations.service.fixtures.js";
import { missingInvitationUserLookup } from "../../helpers/invitations.service.lookups.js";
import {
  createServiceTestInvitationAcceptanceRepository,
  createServiceTestInvitationsRepository,
} from "../../helpers/invitations.service.repositories.js";

describe("InvitationsService acceptInvitation lookup rejections", () => {
  const acceptedAt = new Date("2026-01-02T00:00:00.000Z");

  it("reports a missing pending invitation", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository({
      findPendingById: vi.fn(() => Promise.resolve(null)),
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
      status: "not-found",
      message: invitationNotFoundMessage,
    });
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).not.toHaveBeenCalled();
  });

  it("reports a missing accepting user", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const invitationAcceptanceRepository = createServiceTestInvitationAcceptanceRepository();
    const service = createServiceTestInvitationsService({
      invitationAcceptanceRepository,
      invitationsRepository,
      now: () => acceptedAt,
      userLookup: missingInvitationUserLookup,
    });

    const result = await service.acceptInvitation({
      invitationId: invitationServiceTestInvitation.id,
      userId: invitationServiceTestUserId,
    });

    expect(result).toEqual({
      status: "not-found",
      message: invitationUserNotFoundMessage,
    });
    expect(
      invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership,
    ).not.toHaveBeenCalled();
  });
});
