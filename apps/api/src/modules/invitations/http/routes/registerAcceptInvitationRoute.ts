import type { FastifyInstance } from "fastify";

import { requireAuth } from "../../../../app/auth/requireAuth.js";
import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { InvitationsService } from "../../service/invitations.service.js";
import { toInvitationResponse } from "../invitations.mapper.js";
import { acceptInvitationRequestSchema } from "../invitations.routes.schemas.js";

export function registerAcceptInvitationRoute(
  app: FastifyInstance,
  invitationsService: InvitationsService,
): void {
  app.post("/invitations/:invitationId/accept", async (request) => {
    const validatedRequest = validateRequest(acceptInvitationRequestSchema, request);
    const auth = requireAuth(request, app);

    const result = await invitationsService.acceptInvitation({
      invitationId: validatedRequest.params.invitationId,
      userId: auth.userId,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "conflict":
        throw app.httpErrors.conflict(result.message);
      case "accepted":
        return {
          invitation: toInvitationResponse(result.invitation),
        };
    }
  });
}
