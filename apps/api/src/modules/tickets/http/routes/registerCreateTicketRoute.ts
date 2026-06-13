import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/access/organizationAccess.service.js";
import type { TicketsService } from "../../service/tickets.service.js";
import { toTicketResponse } from "../tickets.mapper.js";
import { authorizeOrganizationTicketCreate } from "../tickets.routes.authorization.js";
import { createTicketRequestSchema } from "../tickets.routes.schemas.js";

export function registerCreateTicketRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  ticketsService: TicketsService,
): void {
  app.post("/organizations/:organizationId/tickets", async (request, reply) => {
    const validatedRequest = validateRequest(createTicketRequestSchema, request);
    await authorizeOrganizationTicketCreate(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await ticketsService.createTicket({
      organizationId: validatedRequest.params.organizationId,
      input: validatedRequest.body,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "created":
        return reply.code(201).send({
          ticket: toTicketResponse(result.ticket),
        });
    }
  });
}
