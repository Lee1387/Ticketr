import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/access/organizationAccess.service.js";
import type { TicketsService } from "../../service/tickets.service.js";
import { toTicketResponse } from "../tickets.mapper.js";
import { authorizeOrganizationTicketStatusUpdate } from "../tickets.routes.authorization.js";
import { updateTicketStatusRequestSchema } from "../tickets.routes.schemas.js";

export function registerUpdateTicketStatusRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  ticketsService: TicketsService,
): void {
  app.patch("/organizations/:organizationId/tickets/:ticketId/status", async (request) => {
    const validatedRequest = validateRequest(updateTicketStatusRequestSchema, request);
    await authorizeOrganizationTicketStatusUpdate(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await ticketsService.updateTicketStatus({
      organizationId: validatedRequest.params.organizationId,
      ticketId: validatedRequest.params.ticketId,
      input: validatedRequest.body,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "conflict":
        throw app.httpErrors.conflict(result.message);
      case "updated":
        return {
          ticket: toTicketResponse(result.ticket),
        };
    }
  });
}
