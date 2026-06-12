import { invitationNotFoundMessage } from "../domain/invitations.constants.js";
import type { InvitationsRepositoryPort } from "./invitations.service.ports.js";
import type {
  RevokeInvitationCommand,
  RevokeInvitationResult,
} from "./invitations.service.types.js";

type RevokeInvitationDependencies = {
  invitationsRepository: InvitationsRepositoryPort;
};

export async function revokeInvitation(
  command: RevokeInvitationCommand,
  dependencies: RevokeInvitationDependencies,
): Promise<RevokeInvitationResult> {
  const invitation = await dependencies.invitationsRepository.revokePendingById(
    command.invitationId,
  );

  if (invitation === null) {
    return {
      status: "not-found",
      message: invitationNotFoundMessage,
    };
  }

  return {
    status: "revoked",
    invitation,
  };
}
