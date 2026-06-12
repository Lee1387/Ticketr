import { ticketNotFoundMessage } from "../domain/tickets.constants.js";
import type { TicketLookup } from "./tickets.service.ports.js";
import type { GetTicketQuery, GetTicketResult } from "./tickets.service.types.js";

type GetTicketDependencies = {
  ticketsRepository: TicketLookup;
};

export async function getTicket(
  query: GetTicketQuery,
  dependencies: GetTicketDependencies,
): Promise<GetTicketResult> {
  const ticket = await dependencies.ticketsRepository.findByOrganizationIdAndId({
    id: query.ticketId,
    organizationId: query.organizationId,
  });

  if (ticket === null) {
    return {
      status: "not-found",
      message: ticketNotFoundMessage,
    };
  }

  return {
    status: "found",
    ticket,
  };
}
