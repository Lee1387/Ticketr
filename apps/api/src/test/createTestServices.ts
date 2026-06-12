import type { AppServices } from "../app/appServices.js";
import { AuthService } from "../modules/auth/service/auth.service.js";
import { InvitationsService } from "../modules/invitations/service/invitations.service.js";
import { OrganizationAccessService } from "../modules/organizations/service/organizationAccess.service.js";
import { OrganizationsService } from "../modules/organizations/service/organizations.service.js";
import { TicketsService } from "../modules/tickets/service/tickets.service.js";
import {
  defaultTestInvitationAcceptanceRepository,
  defaultTestInvitationsRepository,
} from "./repositories/invitationsTestRepository.js";
import {
  defaultTestOrganizationMembershipLookup,
  defaultTestOrganizationsRepository,
} from "./repositories/organizationsTestRepository.js";
import { defaultTestAuthenticatedUserLookup } from "./repositories/authTestRepository.js";
import { defaultTestTicketsRepository } from "./repositories/ticketsTestRepository.js";

export function createTestServices(overrides: Partial<AppServices> = {}): AppServices {
  return {
    authService: overrides.authService ?? new AuthService(defaultTestAuthenticatedUserLookup),
    invitationsService:
      overrides.invitationsService ??
      new InvitationsService(
        defaultTestOrganizationsRepository,
        defaultTestAuthenticatedUserLookup,
        defaultTestOrganizationMembershipLookup,
        defaultTestInvitationsRepository,
        defaultTestInvitationAcceptanceRepository,
      ),
    organizationAccessService:
      overrides.organizationAccessService ??
      new OrganizationAccessService(defaultTestOrganizationMembershipLookup),
    organizationsService:
      overrides.organizationsService ??
      new OrganizationsService(defaultTestOrganizationsRepository),
    ticketsService:
      overrides.ticketsService ??
      new TicketsService(defaultTestOrganizationsRepository, defaultTestTicketsRepository),
  };
}
