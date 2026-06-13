import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/access/organizationAccess.service.js";
import type { InvitationsService } from "../../service/invitations.service.js";
import { toInvitationResponse } from "../invitations.mapper.js";
import { authorizeOrganizationInvitationCreate } from "../invitations.routes.authorization.js";
import { createInvitationRequestSchema } from "../invitations.routes.schemas.js";

export function registerCreateInvitationRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  invitationsService: InvitationsService,
): void {
  app.post("/organizations/:organizationId/invitations", async (request, reply) => {
    const validatedRequest = validateRequest(createInvitationRequestSchema, request);
    await authorizeOrganizationInvitationCreate(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await invitationsService.createInvitation({
      ...validatedRequest.body,
      organizationId: validatedRequest.params.organizationId,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "conflict":
        throw app.httpErrors.conflict(result.message);
      case "created":
        return reply.code(201).send({
          invitation: toInvitationResponse(result.invitation),
        });
    }
  });
}
