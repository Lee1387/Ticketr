import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "../../modules/health/health.routes.js";
import { registerOrganizationRoutes } from "../../modules/organizations/organizations.routes.js";
import { registerTicketRoutes } from "../../modules/tickets/tickets.routes.js";
import type { AppServices } from "../appServices.js";

export function registerRoutes(app: FastifyInstance, services: AppServices): void {
  registerHealthRoutes(app);
  registerOrganizationRoutes(
    app,
    services.organizationAccessService,
    services.organizationsService,
  );
  registerTicketRoutes(app, services.organizationAccessService, services.ticketsService);
}
