import type { DatabaseClient } from "../infrastructure/db/client.js";
import { AuthService } from "../modules/auth/service/auth.service.js";
import { InvitationAcceptanceRepository } from "../modules/invitations/persistence/invitationAcceptance.repository.js";
import { InvitationsRepository } from "../modules/invitations/persistence/invitations.repository.js";
import { InvitationsService } from "../modules/invitations/service/invitations.service.js";
import { OrganizationMembersRepository } from "../modules/organizations/persistence/organizationMembers.repository.js";
import { OrganizationsRepository } from "../modules/organizations/persistence/organizations.repository.js";
import { OrganizationAccessService } from "../modules/organizations/service/organizationAccess.service.js";
import { OrganizationsService } from "../modules/organizations/service/organizations.service.js";
import { TicketsRepository } from "../modules/tickets/persistence/tickets.repository.js";
import { TicketsService } from "../modules/tickets/service/tickets.service.js";
import { UsersRepository } from "../modules/users/persistence/users.repository.js";
import type { AppServices } from "./appServices.js";

export function createAppServices(db: DatabaseClient): AppServices {
  const organizationMembersRepository = new OrganizationMembersRepository(db);
  const organizationsRepository = new OrganizationsRepository(db);
  const invitationAcceptanceRepository = new InvitationAcceptanceRepository(db);
  const invitationsRepository = new InvitationsRepository(db);
  const ticketsRepository = new TicketsRepository(db);
  const usersRepository = new UsersRepository(db);

  return {
    authService: new AuthService(usersRepository),
    invitationsService: new InvitationsService(
      organizationsRepository,
      usersRepository,
      organizationMembersRepository,
      invitationsRepository,
      invitationAcceptanceRepository,
    ),
    organizationAccessService: new OrganizationAccessService(organizationMembersRepository),
    organizationsService: new OrganizationsService(
      organizationsRepository,
      organizationMembersRepository,
      organizationMembersRepository,
      organizationMembersRepository,
    ),
    ticketsService: new TicketsService(organizationsRepository, ticketsRepository),
  };
}
