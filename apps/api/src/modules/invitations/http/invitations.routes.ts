import type { FastifyInstance } from "fastify";

import type { OrganizationAccessService } from "../../organizations/service/access/organizationAccess.service.js";
import type { InvitationsService } from "../service/invitations.service.js";
import { registerAcceptInvitationRoute } from "./routes/registerAcceptInvitationRoute.js";
import { registerCreateInvitationRoute } from "./routes/registerCreateInvitationRoute.js";
import { registerListInvitationsRoute } from "./routes/registerListInvitationsRoute.js";
import { registerRevokeInvitationRoute } from "./routes/registerRevokeInvitationRoute.js";

export function registerInvitationRoutes(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  invitationsService: InvitationsService,
): void {
  registerAcceptInvitationRoute(app, invitationsService);
  registerCreateInvitationRoute(app, organizationAccessService, invitationsService);
  registerListInvitationsRoute(app, organizationAccessService, invitationsService);
  registerRevokeInvitationRoute(app, organizationAccessService, invitationsService);
}
