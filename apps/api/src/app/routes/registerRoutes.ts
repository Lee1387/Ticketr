import type { FastifyInstance } from "fastify";

import { registerAuthRoutes } from "../../modules/auth/http/auth.routes.js";
import { registerHealthRoutes } from "../../modules/health/http/health.routes.js";
import { registerInvitationRoutes } from "../../modules/invitations/http/invitations.routes.js";
import { registerOrganizationRoutes } from "../../modules/organizations/http/organizations.routes.js";
import { registerTicketRoutes } from "../../modules/tickets/http/tickets.routes.js";
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
  registerInvitationRoutes(app, services.organizationAccessService, services.invitationsService);
  registerOrganizationRoutes(
    app,
    services.organizationAccessService,
    services.organizationsService,
  );
  registerTicketRoutes(app, services.organizationAccessService, services.ticketsService);
}
