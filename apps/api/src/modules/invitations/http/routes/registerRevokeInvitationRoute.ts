import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/access/organizationAccess.service.js";
import type { InvitationsService } from "../../service/invitations.service.js";
import { toInvitationResponse } from "../invitations.mapper.js";
import { authorizeOrganizationInvitationRevoke } from "../invitations.routes.authorization.js";
import { revokeInvitationRequestSchema } from "../invitations.routes.schemas.js";

export function registerRevokeInvitationRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  invitationsService: InvitationsService,
): void {
  app.delete("/organizations/:organizationId/invitations/:invitationId", async (request) => {
    const validatedRequest = validateRequest(revokeInvitationRequestSchema, request);
    await authorizeOrganizationInvitationRevoke(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await invitationsService.revokeInvitation({
      invitationId: validatedRequest.params.invitationId,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "revoked":
        return {
          invitation: toInvitationResponse(result.invitation),
        };
    }
  });
}
