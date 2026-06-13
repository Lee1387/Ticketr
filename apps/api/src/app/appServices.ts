import type { AuthService } from "../modules/auth/service/auth.service.js";
import type { InvitationsService } from "../modules/invitations/service/invitations.service.js";
import type { OrganizationAccessService } from "../modules/organizations/service/access/organizationAccess.service.js";
import type { OrganizationsService } from "../modules/organizations/service/organizations.service.js";
import type { TicketsService } from "../modules/tickets/service/tickets.service.js";

export type AppServices = {
  authService: AuthService;
  invitationsService: InvitationsService;
  organizationAccessService: OrganizationAccessService;
  organizationsService: OrganizationsService;
  ticketsService: TicketsService;
};
