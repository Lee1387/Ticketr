import { describe, expect, it, vi } from "vitest";

import { invitationNotFoundMessage } from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";

describe("InvitationsService revokeInvitation", () => {
  it("revokes a pending invitation", async () => {
    const revokedInvitation = {
      ...invitationServiceTestInvitation,
      status: "revoked" as const,
    };
    const invitationsRepository = createServiceTestInvitationsRepository({
      revokePendingById: vi.fn(() => Promise.resolve(revokedInvitation)),
    });
    const service = createServiceTestInvitationsService({
      invitationsRepository,
    });

    const result = await service.revokeInvitation({
      invitationId: invitationServiceTestInvitation.id,
    });

    expect(result).toEqual({
      status: "revoked",
      invitation: revokedInvitation,
    });
    expect(invitationsRepository.revokePendingById).toHaveBeenCalledWith(
      invitationServiceTestInvitation.id,
    );
  });

  it("reports a missing pending invitation", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository({
      revokePendingById: vi.fn(() => Promise.resolve(null)),
    });
    const service = createServiceTestInvitationsService({
      invitationsRepository,
    });

    const result = await service.revokeInvitation({
      invitationId: invitationServiceTestInvitation.id,
    });

    expect(result).toEqual({
      status: "not-found",
      message: invitationNotFoundMessage,
    });
  });
});
