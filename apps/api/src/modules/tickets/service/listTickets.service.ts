import { ticketOrganizationNotFoundMessage } from "../domain/tickets.constants.js";
import type { OrganizationLookup, TicketLister } from "./tickets.service.ports.js";
import type { ListTicketsQuery, ListTicketsResult } from "./tickets.service.types.js";

type ListTicketsDependencies = {
  organizationLookup: OrganizationLookup;
  ticketsRepository: TicketLister;
};

export async function listTickets(
  query: ListTicketsQuery,
  dependencies: ListTicketsDependencies,
): Promise<ListTicketsResult> {
  const organization = await dependencies.organizationLookup.findById(query.organizationId);

  if (organization === null) {
    return {
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    };
  }

  const tickets = await dependencies.ticketsRepository.listByOrganizationId({
    organizationId: query.organizationId,
    limit: query.query.limit,
    ...(query.query.createdBefore === undefined
      ? {}
      : { createdBefore: query.query.createdBefore }),
  });

  return {
    status: "found",
    tickets,
  };
}
