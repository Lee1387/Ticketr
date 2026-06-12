import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { requireAuth } from "../../app/auth/requireAuth.js";
import { validateRequest } from "../../app/validation/validateRequest.js";
import {
  canCreateOrganizationTicket,
  canReadOrganizationTickets,
  canUpdateOrganizationTicketStatus,
} from "../organizations/organizations.policy.js";
import { organizationIdSchema } from "../organizations/organizations.schemas.js";
import type {
  OrganizationId,
  OrganizationMemberRole,
} from "../organizations/organizations.types.js";
import { toTicketResponse } from "./tickets.mapper.js";
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdSchema,
  updateTicketStatusSchema,
} from "./tickets.schemas.js";
import type { TicketsService } from "./tickets.service.js";

const listTicketsRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: listTicketsQuerySchema,
});

const getTicketRequestSchema = z.object({
  body: z.undefined(),
  params: z.object({
    organizationId: organizationIdSchema,
    ticketId: ticketIdSchema,
  }),
  query: z.object({}),
});

const createTicketRequestSchema = z.object({
  body: createTicketSchema,
  params: z.object({
    organizationId: organizationIdSchema,
  }),
  query: z.object({}),
});

const updateTicketStatusRequestSchema = z.object({
  body: updateTicketStatusSchema,
  params: z.object({
    organizationId: organizationIdSchema,
    ticketId: ticketIdSchema,
  }),
  query: z.object({}),
});

export function registerTicketRoutes(app: FastifyInstance, ticketsService: TicketsService): void {
  app.get("/organizations/:organizationId/tickets", async (request) => {
    const validatedRequest = validateRequest(listTicketsRequestSchema, request);
    authorizeOrganizationTicketRead(app, request, validatedRequest.params.organizationId);

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
    authorizeOrganizationTicketRead(app, request, validatedRequest.params.organizationId);

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
    authorizeOrganizationTicketCreate(app, request, validatedRequest.params.organizationId);

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
    authorizeOrganizationTicketStatusUpdate(app, request, validatedRequest.params.organizationId);

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

function authorizeOrganizationTicketRead(
  app: FastifyInstance,
  request: FastifyRequest,
  organizationId: OrganizationId,
): void {
  authorizeOrganizationTicketAction(
    app,
    request,
    organizationId,
    canReadOrganizationTickets,
    "You do not have access to this organization's tickets.",
  );
}

function authorizeOrganizationTicketCreate(
  app: FastifyInstance,
  request: FastifyRequest,
  organizationId: OrganizationId,
): void {
  authorizeOrganizationTicketAction(
    app,
    request,
    organizationId,
    canCreateOrganizationTicket,
    "You do not have access to create tickets for this organization.",
  );
}

function authorizeOrganizationTicketStatusUpdate(
  app: FastifyInstance,
  request: FastifyRequest,
  organizationId: OrganizationId,
): void {
  authorizeOrganizationTicketAction(
    app,
    request,
    organizationId,
    canUpdateOrganizationTicketStatus,
    "You do not have access to update ticket status for this organization.",
  );
}

function authorizeOrganizationTicketAction(
  app: FastifyInstance,
  request: FastifyRequest,
  organizationId: OrganizationId,
  canAccess: (input: {
    organizationId: OrganizationId;
    requestedOrganizationId: OrganizationId;
    role: OrganizationMemberRole;
  }) => boolean,
  forbiddenMessage: string,
): void {
  const auth = requireAuth(request, app);

  if (
    !canAccess({
      organizationId: auth.organizationId,
      requestedOrganizationId: organizationId,
      role: auth.organizationRole,
    })
  ) {
    throw app.httpErrors.forbidden(forbiddenMessage);
  }
}
