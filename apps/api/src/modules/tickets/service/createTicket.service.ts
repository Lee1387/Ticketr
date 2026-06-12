import { ticketOrganizationNotFoundMessage } from "../domain/tickets.constants.js";
import type { OrganizationLookup, TicketCreator } from "./tickets.service.ports.js";
import type { CreateTicketCommand, CreateTicketResult } from "./tickets.service.types.js";

type CreateTicketDependencies = {
  organizationLookup: OrganizationLookup;
  ticketsRepository: TicketCreator;
};

export async function createTicket(
  command: CreateTicketCommand,
  dependencies: CreateTicketDependencies,
): Promise<CreateTicketResult> {
  const organization = await dependencies.organizationLookup.findById(command.organizationId);

  if (organization === null) {
    return {
      status: "not-found",
      message: ticketOrganizationNotFoundMessage,
    };
  }

  const ticket = await dependencies.ticketsRepository.create({
    organizationId: command.organizationId,
    subject: command.input.subject,
    description: command.input.description,
    priority: command.input.priority,
  });

  return {
    status: "created",
    ticket,
  };
}
