import type { FastifyInstance } from "fastify";

import { registerAuthRoutes } from "../../modules/auth/auth.routes.js";
import { registerHealthRoutes } from "../../modules/health/health.routes.js";
import { registerOrganizationRoutes } from "../../modules/organizations/organizations.routes.js";
import { registerTicketRoutes } from "../../modules/tickets/tickets.routes.js";
import type { AppServices } from "../appServices.js";

export type RegisterRoutesOptions = {
  enableDevelopmentAuthRoutes: boolean;
};

export function registerRoutes(
  app: FastifyInstance,
  services: AppServices,
  options: RegisterRoutesOptions,
): void {
  registerHealthRoutes(app);
  registerAuthRoutes(app, services.authService, services.organizationAccessService, {
    enableDevelopmentAuthRoutes: options.enableDevelopmentAuthRoutes,
  });
  registerOrganizationRoutes(
    app,
    services.organizationAccessService,
    services.organizationsService,
  );
  registerTicketRoutes(app, services.organizationAccessService, services.ticketsService);
}
