import type { OrganizationsService } from "../modules/organizations/organizations.service.js";
import type { TicketsService } from "../modules/tickets/tickets.service.js";

export type AppServices = {
  organizationsService: OrganizationsService;
  ticketsService: TicketsService;
};
