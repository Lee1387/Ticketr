import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../../../organizations/service/organizationAccess.service.js";
import type { TicketsService } from "../../service/tickets.service.js";
import { toTicketResponse } from "../tickets.mapper.js";
import { authorizeOrganizationTicketRead } from "../tickets.routes.authorization.js";
import { listTicketsRequestSchema } from "../tickets.routes.schemas.js";

export function registerListTicketsRoute(
  app: FastifyInstance,
  organizationAccessService: OrganizationAccessService,
  ticketsService: TicketsService,
): void {
  app.get("/organizations/:organizationId/tickets", async (request) => {
    const validatedRequest = validateRequest(listTicketsRequestSchema, request);
    await authorizeOrganizationTicketRead(
      app,
      organizationAccessService,
      request,
      validatedRequest.params.organizationId,
    );

    const result = await ticketsService.listTickets({
      organizationId: validatedRequest.params.organizationId,
      query: validatedRequest.query,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "found":
        return {
          tickets: result.tickets.map(toTicketResponse),
        };
    }
  });
}
