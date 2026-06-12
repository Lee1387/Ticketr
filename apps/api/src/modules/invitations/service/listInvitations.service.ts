import { invitationOrganizationNotFoundMessage } from "../domain/invitations.constants.js";
import type {
  InvitationOrganizationLookup,
  InvitationsRepositoryPort,
} from "./invitations.service.ports.js";
import type { ListInvitationsQuery, ListInvitationsResult } from "./invitations.service.types.js";

type ListInvitationsDependencies = {
  invitationsRepository: InvitationsRepositoryPort;
  organizationLookup: InvitationOrganizationLookup;
};

export async function listInvitations(
  query: ListInvitationsQuery,
  dependencies: ListInvitationsDependencies,
): Promise<ListInvitationsResult> {
  const organization = await dependencies.organizationLookup.findById(query.organizationId);

  if (organization === null) {
    return {
      status: "not-found",
      message: invitationOrganizationNotFoundMessage,
    };
  }

  const invitations = await dependencies.invitationsRepository.listPendingByOrganizationId({
    organizationId: query.organizationId,
    limit: query.query.limit,
    ...(query.query.createdBefore === undefined
      ? {}
      : { createdBefore: query.query.createdBefore }),
  });

  return {
    status: "found",
    invitations,
  };
}
