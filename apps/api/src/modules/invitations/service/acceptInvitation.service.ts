import {
  invitationAlreadyAcceptedMessage,
  invitationEmailMismatchMessage,
  invitationExpiredMessage,
  invitationNotFoundMessage,
  invitationUserInactiveMessage,
  invitationUserNotFoundMessage,
} from "../domain/invitations.constants.js";
import type {
  AcceptInvitationCommand,
  AcceptInvitationResult,
} from "./invitations.service.types.js";
import type {
  InvitationAcceptanceRepositoryPort,
  InvitationMembershipLookup,
  InvitationUserLookup,
  InvitationsRepositoryPort,
} from "./invitations.service.ports.js";

type AcceptInvitationDependencies = {
  invitationAcceptanceRepository: InvitationAcceptanceRepositoryPort;
  invitationsRepository: InvitationsRepositoryPort;
  membershipLookup: InvitationMembershipLookup;
  now: () => Date;
  userLookup: InvitationUserLookup;
};

export async function acceptInvitation(
  command: AcceptInvitationCommand,
  dependencies: AcceptInvitationDependencies,
): Promise<AcceptInvitationResult> {
  const invitation = await dependencies.invitationsRepository.findPendingById(command.invitationId);

  if (invitation === null) {
    return {
      status: "not-found",
      message: invitationNotFoundMessage,
    };
  }

  const user = await dependencies.userLookup.findById(command.userId);

  if (user === null) {
    return {
      status: "not-found",
      message: invitationUserNotFoundMessage,
    };
  }

  if (user.status !== "active") {
    return {
      status: "conflict",
      message: invitationUserInactiveMessage,
    };
  }

  if (user.email !== invitation.email) {
    return {
      status: "conflict",
      message: invitationEmailMismatchMessage,
    };
  }

  const acceptedAt = dependencies.now();

  if (invitation.expiresAt <= acceptedAt) {
    return {
      status: "conflict",
      message: invitationExpiredMessage,
    };
  }

  const existingMembership = await dependencies.membershipLookup.findByOrganizationIdAndUserId({
    organizationId: invitation.organizationId,
    userId: user.id,
  });

  if (existingMembership !== null) {
    return {
      status: "conflict",
      message: invitationAlreadyAcceptedMessage,
    };
  }

  const acceptedInvitation =
    await dependencies.invitationAcceptanceRepository.acceptPendingByIdAndCreateMembership({
      acceptedAt,
      id: command.invitationId,
      organizationId: invitation.organizationId,
      role: invitation.role,
      userId: user.id,
    });

  if (acceptedInvitation === null) {
    return {
      status: "not-found",
      message: invitationNotFoundMessage,
    };
  }

  return {
    status: "accepted",
    invitation: acceptedInvitation,
  };
}
