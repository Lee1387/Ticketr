import { describe, expect, it, vi } from "vitest";

import { invitationOrganizationNotFoundMessage } from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import { invitationServiceTestInvitation } from "../../helpers/invitations.service.fixtures.js";
import { missingInvitationOrganizationLookup } from "../../helpers/invitations.service.lookups.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";

describe("InvitationsService listInvitations", () => {
  it("lists invitations for an existing organization", async () => {
    const createdBefore = new Date("2026-01-02T00:00:00.000Z");
    const invitationsRepository = createServiceTestInvitationsRepository({
      listPendingByOrganizationId: vi.fn(() => Promise.resolve([invitationServiceTestInvitation])),
    });
    const service = createServiceTestInvitationsService({
      invitationsRepository,
    });

    const result = await service.listInvitations({
      organizationId: invitationServiceTestInvitation.organizationId,
      query: {
        limit: 10,
        createdBefore,
      },
    });

    expect(result).toEqual({
      status: "found",
      invitations: [invitationServiceTestInvitation],
    });
    expect(invitationsRepository.listPendingByOrganizationId).toHaveBeenCalledWith({
      organizationId: invitationServiceTestInvitation.organizationId,
      limit: 10,
      createdBefore,
    });
  });

  it("reports a missing organization before listing invitations", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository({
      listPendingByOrganizationId: vi.fn(() => Promise.resolve([invitationServiceTestInvitation])),
    });
    const service = createServiceTestInvitationsService({
      invitationsRepository,
      organizationLookup: missingInvitationOrganizationLookup,
    });

    const result = await service.listInvitations({
      organizationId: invitationServiceTestInvitation.organizationId,
      query: {
        limit: 10,
      },
    });

    expect(result).toEqual({
      status: "not-found",
      message: invitationOrganizationNotFoundMessage,
    });
    expect(invitationsRepository.listPendingByOrganizationId).not.toHaveBeenCalled();
  });
});
