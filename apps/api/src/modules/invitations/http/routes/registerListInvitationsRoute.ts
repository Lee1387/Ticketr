import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/access/organizationAccess.service.js";
import type { InvitationsService } from "../../service/invitations.service.js";
import { toInvitationResponse } from "../invitations.mapper.js";
import { authorizeOrganizationInvitationList } from "../invitations.routes.authorization.js";
import { listInvitationsRequestSchema } from "../invitations.routes.schemas.js";

export function registerListInvitationsRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  invitationsService: InvitationsService,
): void {
  app.get("/organizations/:organizationId/invitations", async (request) => {
    const validatedRequest = validateRequest(listInvitationsRequestSchema, request);
    await authorizeOrganizationInvitationList(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await invitationsService.listInvitations({
      organizationId: validatedRequest.params.organizationId,
      query: validatedRequest.query,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "found":
        return {
          invitations: result.invitations.map(toInvitationResponse),
        };
    }
  });
}
