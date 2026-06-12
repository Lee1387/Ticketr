import { describe, expect, it, vi } from "vitest";

import {
  invitationAlreadyPendingMessage,
  invitationOrganizationInactiveMessage,
  invitationOrganizationNotFoundMessage,
} from "../../../domain/invitations.constants.js";
import { createServiceTestInvitationsService } from "../../helpers/invitations.service.factory.js";
import {
  invitationServiceTestInvitation,
  invitationServiceTestOrganizationId,
} from "../../helpers/invitations.service.fixtures.js";
import { missingInvitationOrganizationLookup } from "../../helpers/invitations.service.lookups.js";
import { createServiceTestInvitationsRepository } from "../../helpers/invitations.service.repositories.js";

describe("InvitationsService createInvitation", () => {
  const command = {
    email: invitationServiceTestInvitation.email,
    expiresAt: invitationServiceTestInvitation.expiresAt,
    organizationId: invitationServiceTestOrganizationId,
    role: invitationServiceTestInvitation.role,
  };

  it("creates an invitation for an active organization", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const service = createServiceTestInvitationsService({
      invitationsRepository,
    });

    const result = await service.createInvitation(command);

    expect(result).toEqual({
      status: "created",
      invitation: invitationServiceTestInvitation,
    });
    expect(invitationsRepository.create).toHaveBeenCalledWith(command);
  });

  it("reports a missing organization before creating an invitation", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository();
    const service = createServiceTestInvitationsService({
      invitationsRepository,
      organizationLookup: missingInvitationOrganizationLookup,
    });

    const result = await service.createInvitation(command);

    expect(result).toEqual({
      status: "not-found",
      message: invitationOrganizationNotFoundMessage,
    });
    expect(invitationsRepository.create).not.toHaveBeenCalled();
  });

  it("rejects invitations for inactive organizations", async () => {
    const organizationLookup = {
      findById: vi.fn(() =>
        Promise.resolve({
          id: invitationServiceTestOrganizationId,
          status: "suspended" as const,
        }),
      ),
    };
    const invitationsRepository = createServiceTestInvitationsRepository();
    const service = createServiceTestInvitationsService({
      invitationsRepository,
      organizationLookup,
    });

    const result = await service.createInvitation(command);

    expect(result).toEqual({
      status: "conflict",
      message: invitationOrganizationInactiveMessage,
    });
    expect(invitationsRepository.create).not.toHaveBeenCalled();
  });

  it("rejects duplicate pending invitations", async () => {
    const invitationsRepository = createServiceTestInvitationsRepository({
      findPendingByOrganizationIdAndEmail: vi.fn(() =>
        Promise.resolve(invitationServiceTestInvitation),
      ),
    });
    const service = createServiceTestInvitationsService({
      invitationsRepository,
    });

    const result = await service.createInvitation(command);

    expect(result).toEqual({
      status: "conflict",
      message: invitationAlreadyPendingMessage,
    });
    expect(invitationsRepository.create).not.toHaveBeenCalled();
  });
});
