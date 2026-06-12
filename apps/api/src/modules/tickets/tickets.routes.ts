import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { validateRequest } from "../../app/validation/validateRequest.js";
import { organizationIdSchema } from "../organizations/organizations.schemas.js";
import { createTicketSchema } from "./tickets.schemas.js";
import type { TicketsService } from "./tickets.service.js";

const createTicketRequestSchema = z.object({
  body: createTicketSchema,
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

export function registerTicketRoutes(app: FastifyInstance, ticketsService: TicketsService): void {
  app.post("/organizations/:organizationId/tickets", async (request) => {
    const validatedRequest = validateRequest(createTicketRequestSchema, request);
    const result = await ticketsService.createTicket({
      organizationId: validatedRequest.params.organizationId,
      input: validatedRequest.body,
    });

    switch (result.status) {
      case "not-found":
        throw app.httpErrors.notFound(result.message);
      case "not-implemented":
        throw app.httpErrors.notImplemented(result.message);
    }
  });
}
