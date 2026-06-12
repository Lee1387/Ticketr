import type { FastifyInstance } from "fastify";

import type { OrganizationAccessService } from "../../organizations/service/organizationAccess.service.js";
import type { TicketsService } from "../service/tickets.service.js";
import { registerCreateTicketRoute } from "./routes/registerCreateTicketRoute.js";
import { registerGetTicketRoute } from "./routes/registerGetTicketRoute.js";
import { registerListTicketsRoute } from "./routes/registerListTicketsRoute.js";
import { registerUpdateTicketStatusRoute } from "./routes/registerUpdateTicketStatusRoute.js";

export function registerTicketRoutes(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  ticketsService: TicketsService,
): void {
  registerListTicketsRoute(app, organizationAccessService, ticketsService);
  registerGetTicketRoute(app, organizationAccessService, ticketsService);
  registerCreateTicketRoute(app, organizationAccessService, ticketsService);
  registerUpdateTicketStatusRoute(app, organizationAccessService, ticketsService);
}
