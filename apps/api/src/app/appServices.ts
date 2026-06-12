import type { OrganizationAccessService } from "../modules/organizations/organizationAccess.service.js";
import type { OrganizationsService } from "../modules/organizations/organizations.service.js";
import type { TicketsService } from "../modules/tickets/tickets.service.js";

export type AppServices = {
  organizationAccessService: OrganizationAccessService;
  organizationsService: OrganizationsService;
  ticketsService: TicketsService;
};
