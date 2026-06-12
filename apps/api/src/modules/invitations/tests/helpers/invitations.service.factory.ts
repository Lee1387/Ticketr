import type {
  InvitationAcceptanceRepositoryPort,
  InvitationMembershipLookup,
  InvitationOrganizationLookup,
  InvitationUserLookup,
  InvitationsRepositoryPort,
} from "../../service/invitations.service.ports.js";
import { InvitationsService } from "../../service/invitations.service.js";
import {
  activeInvitationOrganizationLookup,
  activeInvitationUserLookup,
  emptyInvitationMembershipLookup,
} from "./invitations.service.lookups.js";
import {
  createServiceTestInvitationAcceptanceRepository,
  createServiceTestInvitationsRepository,
} from "./invitations.service.repositories.js";

type CreateServiceTestInvitationsServiceOptions = {
  invitationAcceptanceRepository?: InvitationAcceptanceRepositoryPort;
  invitationsRepository?: InvitationsRepositoryPort;
  membershipLookup?: InvitationMembershipLookup;
  now?: () => Date;
  organizationLookup?: InvitationOrganizationLookup;
  userLookup?: InvitationUserLookup;
};

export function createServiceTestInvitationsService(
  options: CreateServiceTestInvitationsServiceOptions = {},
): InvitationsService {
  return new InvitationsService(
    options.organizationLookup ?? activeInvitationOrganizationLookup,
    options.userLookup ?? activeInvitationUserLookup,
    options.membershipLookup ?? emptyInvitationMembershipLookup,
    options.invitationsRepository ?? createServiceTestInvitationsRepository(),
    options.invitationAcceptanceRepository ?? createServiceTestInvitationAcceptanceRepository(),
    options.now,
  );
}
