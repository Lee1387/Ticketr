import type { FastifyInstance } from "fastify";

import { validateRequest } from "../../app/validation/validateRequest.js";
import type { OrganizationAccessService } from "../organizations/organizationAccess.service.js";
import {
  authorizeOrganizationTicketCreate,
  authorizeOrganizationTicketRead,
  authorizeOrganizationTicketStatusUpdate,
} from "./tickets.routes.authorization.js";
import { toTicketResponse } from "./tickets.mapper.js";
import {
  createTicketRequestSchema,
  getTicketRequestSchema,
  listTicketsRequestSchema,
  updateTicketStatusRequestSchema,
} from "./tickets.routes.schemas.js";
import type { TicketsService } from "./tickets.service.js";

export function registerTicketRoutes(
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
