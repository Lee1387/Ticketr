import { acceptInvitation } from "./acceptInvitation.service.js";
import { createInvitation } from "./createInvitation.service.js";
import type {
  AcceptInvitationCommand,
  AcceptInvitationResult,
  CreateInvitationCommand,
  CreateInvitationResult,
  RevokeInvitationCommand,
  RevokeInvitationResult,
} from "./invitations.service.types.js";
import type {
  InvitationAcceptanceRepositoryPort,
  InvitationMembershipLookup,
  InvitationOrganizationLookup,
  InvitationUserLookup,
  InvitationsRepositoryPort,
} from "./invitations.service.ports.js";
import { revokeInvitation } from "./revokeInvitation.service.js";

export class InvitationsService {
  constructor(
    private readonly organizationLookup: InvitationOrganizationLookup,
    private readonly userLookup: InvitationUserLookup,
    private readonly membershipLookup: InvitationMembershipLookup,
    private readonly invitationsRepository: InvitationsRepositoryPort,
    private readonly invitationAcceptanceRepository: InvitationAcceptanceRepositoryPort,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async acceptInvitation(command: AcceptInvitationCommand): Promise<AcceptInvitationResult> {
    return acceptInvitation(command, {
      invitationAcceptanceRepository: this.invitationAcceptanceRepository,
      invitationsRepository: this.invitationsRepository,
      membershipLookup: this.membershipLookup,
      now: this.now,
      userLookup: this.userLookup,
    });
  }

  async createInvitation(command: CreateInvitationCommand): Promise<CreateInvitationResult> {
    return createInvitation(command, {
      invitationsRepository: this.invitationsRepository,
      organizationLookup: this.organizationLookup,
    });
  }

  async revokeInvitation(command: RevokeInvitationCommand): Promise<RevokeInvitationResult> {
    return revokeInvitation(command, {
      invitationsRepository: this.invitationsRepository,
    });
  }
}
