import {
  invitationAlreadyPendingMessage,
  invitationOrganizationInactiveMessage,
  invitationOrganizationNotFoundMessage,
} from "../domain/invitations.constants.js";
import type {
  CreateInvitationCommand,
  CreateInvitationResult,
} from "./invitations.service.types.js";
import type {
  InvitationOrganizationLookup,
  InvitationsRepositoryPort,
} from "./invitations.service.ports.js";

type CreateInvitationDependencies = {
  invitationsRepository: InvitationsRepositoryPort;
  organizationLookup: InvitationOrganizationLookup;
};

export async function createInvitation(
  command: CreateInvitationCommand,
  dependencies: CreateInvitationDependencies,
): Promise<CreateInvitationResult> {
  const organization = await dependencies.organizationLookup.findById(command.organizationId);

  if (organization === null) {
    return {
      status: "not-found",
      message: invitationOrganizationNotFoundMessage,
    };
  }

  if (organization.status !== "active") {
    return {
      status: "conflict",
      message: invitationOrganizationInactiveMessage,
    };
  }

  const existingInvitation =
    await dependencies.invitationsRepository.findPendingByOrganizationIdAndEmail({
      email: command.email,
      organizationId: command.organizationId,
    });

  if (existingInvitation !== null) {
    return {
      status: "conflict",
      message: invitationAlreadyPendingMessage,
    };
  }

  const invitation = await dependencies.invitationsRepository.create({
    email: command.email,
    expiresAt: command.expiresAt,
    organizationId: command.organizationId,
    role: command.role,
  });

  return {
    status: "created",
    invitation,
  };
}
