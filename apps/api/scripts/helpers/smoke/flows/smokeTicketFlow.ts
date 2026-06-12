import { smokeGetJson, smokeJson } from "../client/smokeApiClient.js";
import { createSmokeResult, type SmokeResult } from "../reporting/smokeResult.js";
import { ticketListResponseSchema, ticketResponseSchema } from "../schemas/smokeApiSchemas.js";

type SmokeTicketFlowInput = {
  authorizationHeader: string;
  organizationId: string;
};

export async function runSmokeTicketFlow(input: SmokeTicketFlowInput): Promise<SmokeResult[]> {
  const results: SmokeResult[] = [];
  const ticketList = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId/tickets",
    path: `/organizations/${input.organizationId}/tickets?limit=10`,
    schema: ticketListResponseSchema,
  });
  results.push(
    createSmokeResult(
      "GET /organizations/:organizationId/tickets",
      ticketList.statusCode,
      `count=${String(ticketList.data.tickets.length)}`,
    ),
  );

  const createdTicket = await smokeJson({
    authorizationHeader: input.authorizationHeader,
    body: {
      description: "Created by the Ticketr API smoke script.",
      priority: "normal",
      subject: `Smoke test ticket ${new Date().toISOString()}`,
    },
    method: "POST",
    name: "POST /organizations/:organizationId/tickets",
    path: `/organizations/${input.organizationId}/tickets`,
    expectedStatusCode: 201,
    schema: ticketResponseSchema,
  });
  results.push(
    createSmokeResult(
      "POST /organizations/:organizationId/tickets",
      createdTicket.statusCode,
      `ticketId=${createdTicket.data.ticket.id}`,
    ),
  );

  const readTicket = await smokeGetJson({
    authorizationHeader: input.authorizationHeader,
    name: "GET /organizations/:organizationId/tickets/:ticketId",
    path: `/organizations/${input.organizationId}/tickets/${createdTicket.data.ticket.id}`,
    schema: ticketResponseSchema,
  });
  results.push(
    createSmokeResult(
      "GET /organizations/:organizationId/tickets/:ticketId",
      readTicket.statusCode,
      `status=${readTicket.data.ticket.status}`,
    ),
  );

  const updatedTicket = await smokeJson({
    authorizationHeader: input.authorizationHeader,
    body: {
      status: "pending",
    },
    method: "PATCH",
    name: "PATCH /organizations/:organizationId/tickets/:ticketId/status",
    path: `/organizations/${input.organizationId}/tickets/${createdTicket.data.ticket.id}/status`,
    expectedStatusCode: 200,
    schema: ticketResponseSchema,
  });
  results.push(
    createSmokeResult(
      "PATCH /organizations/:organizationId/tickets/:ticketId/status",
      updatedTicket.statusCode,
      `status=${updatedTicket.data.ticket.status}`,
    ),
  );

  return results;
}
