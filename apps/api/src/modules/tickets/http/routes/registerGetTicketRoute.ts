import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/organizationAccess.service.js";
import type { TicketsService } from "../../service/tickets.service.js";
import { toTicketResponse } from "../tickets.mapper.js";
import { authorizeOrganizationTicketRead } from "../tickets.routes.authorization.js";
import { getTicketRequestSchema } from "../tickets.routes.schemas.js";

export function registerGetTicketRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  ticketsService: TicketsService,
): void {
  app.get("/organizations/:organizationId/tickets/:ticketId", async (request) => {
    const validatedRequest = validateRequest(getTicketRequestSchema, request);
    await authorizeOrganizationTicketRead(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await ticketsService.getTicket({
      organizationId: validatedRequest.params.organizationId,
      ticketId: validatedRequest.params.ticketId,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "found":
        return {
          ticket: toTicketResponse(result.ticket),
        };
    }
  });
}
