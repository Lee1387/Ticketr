import type { FastifyInstance } from "fastify";

import type { OrganizationAccessService } from "../service/organizationAccess.service.js";
import type { OrganizationsService } from "../service/organizations.service.js";
import { registerGetOrganizationRoute } from "./routes/registerGetOrganizationRoute.js";
import { registerListOrganizationMembersRoute } from "./routes/registerListOrganizationMembersRoute.js";

export function registerOrganizationRoutes(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  organizationsService: OrganizationsService,
): void {
  registerGetOrganizationRoute(app, organizationAccessService, organizationsService);
  registerListOrganizationMembersRoute(app, organizationAccessService, organizationsService);
}
