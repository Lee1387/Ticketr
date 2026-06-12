import type { FastifyInstance } from "fastify";

import type { OrganizationAccessService } from "../../organizations/service/organizationAccess.service.js";
import type { AuthService } from "../service/auth.service.js";
import { registerDevelopmentTokenRoute } from "./registerDevelopmentTokenRoute.js";
import { registerLoginRoute } from "./registerLoginRoute.js";

export type RegisterAuthRoutesOptions = {
  enableDevelopmentAuthRoutes: boolean;
};

export function registerAuthRoutes(
  app: FastifyInstance,
  authService: AuthService,
  organizationAccessService: OrganizationAccessService,
  options: RegisterAuthRoutesOptions,
): void {
  registerLoginRoute(app, authService, organizationAccessService);

  if (!options.enableDevelopmentAuthRoutes) {
    return;
  }

  registerDevelopmentTokenRoute(app, authService, organizationAccessService);
}
